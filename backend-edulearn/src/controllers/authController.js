const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
const crypto = require('crypto');
const { sendResetEmail } = require('./../middleware/emailService.js');
const hashResetCode = require('./../middleware/hashCode');



const register = (req, res) => {
  const { nom, prenom, email, motDePasse, role } = req.body;

  if (!nom || !prenom || !email || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  connection.query(
    'SELECT * FROM Utilisateur WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      if (results.length > 0)
        return res.status(400).json({ message: 'Email déjà utilisé' });

      const hashedPassword = await bcrypt.hash(motDePasse, 10);

      connection.query(
        'INSERT INTO Utilisateur (nom, prenom, email, motDePasse, role) VALUES (?, ?, ?, ?, ?)',
        [nom, prenom, email, hashedPassword, role],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
          res.status(201).json({ message: 'Inscription réussie' });
        }
      );
    }
  );
};

const login = (req, res) => {
  const { email, motDePasse } = req.body;

  connection.query(
    'SELECT * FROM Utilisateur WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      if (results.length === 0)
        return res.status(404).json({ message: 'Utilisateur introuvable' });

      const user = results[0];

      // Vérification du statut de l'utilisateur
      if (user.statut === 'suspendu') {
        return res.status(403).json({ message: 'Compte suspendu, contactez l’administrateur' });
      }

      const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

      if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

      // Génération du JWT avec rôle
      const token = jwt.sign(
        { id: user.idUtilisateur, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          idUtilisateur: user.idUtilisateur,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
        }
      });
    }
  );
};


const réinitialisationMotDePass = (req, res) => {
  const { email } = req.body;

  const sql = "SELECT idUtilisateur, email FROM utilisateur WHERE email = ? LIMIT 1";

  connection.query(sql, [email], (err, rows) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ success: false, error: "Erreur serveur" });
    }

    const utilisateur = rows[0];

    // Même réponse si email n'existe pas
    if (!utilisateur) {
      return res.json({
        success: true,
        message: "Si un compte existe avec cet email, un lien a été envoyé."
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const resetCodeHash = hashResetCode(code);
    const expiration = new Date(Date.now() + 30 * 60 * 1000);

    const sqlUpdate = `
      UPDATE utilisateur 
      SET resetPasswordCode = ?, resetPasswordExpires = ? 
      WHERE idUtilisateur = ?
    `;

    connection.query(sqlUpdate, [resetCodeHash, expiration, utilisateur.idUtilisateur], async (err2) => {
      if (err2) {
        console.error("Erreur UPDATE :", err2);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
      }

      try {
        await sendResetEmail(utilisateur.email, code);
      } catch (emailError) {
        // Annuler l'opération en cas d'échec email
        connection.query(
          "UPDATE utilisateur SET resetPasswordCode = NULL, resetPasswordExpires = NULL WHERE id = ?",
          [utilisateur.idUtilisateur]
        );

        return res.status(500).json({
          success: false,
          error: "Erreur lors de l'envoi de l'email."
        });
      }

      res.json({
        success: true,
        message: "Si un compte existe avec cet email, un lien a été envoyé."
      });
    });
  });
};



// =========================================================
// 2️⃣ VÉRIFIER LE CODE
// =========================================================

const verifierCode = (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code requis"
    });
  }

  const resetCodeHash = hashResetCode(code);

  const sql = `
    SELECT email, prenom 
    FROM utilisateur 
    WHERE resetPasswordCode = ? 
      AND resetPasswordExpires > NOW() 
    LIMIT 1
  `;

  connection.query(sql, [resetCodeHash], (err, rows) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ success: false, error: "Erreur serveur" });
    }

    const utilisateur = rows[0];

    if (!utilisateur) {
      return res.status(400).json({
        success: false,
        error: "Code invalide ou expiré"
      });
    }

    res.json({
      success: true,
      valid: true,
      email: utilisateur.email,
      prenom: utilisateur.prenom
    });
  });
};



// =========================================================
// 3️⃣ RÉINITIALISER LE MOT DE PASSE
// =========================================================
const resetMotDePass = (req, res) => {
  const { code, newPassword } = req.body;

  const resetCodeHash = hashResetCode(code);

  const sql = `
    SELECT * 
    FROM utilisateur 
    WHERE resetPasswordCode = ? 
      AND resetPasswordExpires > NOW() 
    LIMIT 1
  `;

  connection.query(sql, [resetCodeHash], async (err, rows) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ success: false, error: "Erreur serveur" });
    }

    const utilisateur = rows[0];

    if (!utilisateur) {
      return res.status(400).json({
        success: false,
        error: "Lien invalide ou expiré"
      });
    }

    const same = await bcrypt.compare(newPassword, utilisateur.motDePasse);
    if (same) {
      return res.status(400).json({
        success: false,
        error: "Le nouveau mot de passe doit être différent"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sqlUpdate = `
      UPDATE utilisateur 
      SET motDePasse = ?, resetPasswordCode = NULL, resetPasswordExpires = NULL 
      WHERE idUtilisateur = ?
    `;

    connection.query(sqlUpdate, [hashedPassword, utilisateur.idUtilisateur], (updateErr) => {
      if (updateErr) {
        console.error("Erreur UPDATE :", updateErr);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
      }

      res.json({
        success: true,
        message: "Mot de passe réinitialisé avec succès"
      });
    });
  });
};


const logout = (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};

const getAllEnseignants = (req, res) => {
  const query = `
    SELECT 
      u.idUtilisateur, 
      u.nom, 
      u.prenom, 
      u.email, 
      u.phone,
      u.role,
      u.created_at,
      u.updated_at,
      COUNT(DISTINCT c.idCours) as nombre_cours
    FROM Utilisateur u
    LEFT JOIN Cours c ON u.idUtilisateur = c.idUtilisateur
    WHERE u.role = 'enseignant'
    GROUP BY u.idUtilisateur 
    ORDER BY u.nom, u.prenom
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des enseignants:', err);
      return res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors de la récupération des enseignants" 
      });
    }
    
    // Formater les données
    const enseignants = results.map(enseignant => ({
      id: enseignant.idUtilisateur,
      nom: enseignant.nom,
      prenom: enseignant.prenom,
      email: enseignant.email,
      telephone: enseignant.phone,
      role: enseignant.role,
      nombreCours: enseignant.nombre_cours || 0,
      dateCreation: enseignant.created_at,
      dateModification: enseignant.updated_at
    }));

    res.json({
      success: true,
      data: enseignants,
      total: enseignants.length
    });
  });
};

module.exports = {
  register,
  login,
  réinitialisationMotDePass,
  resetMotDePass,
  verifierCode,
  logout,
  getAllEnseignants
};

