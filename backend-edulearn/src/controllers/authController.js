const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
      const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

      if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

      // on inclut le rôle dans le JWT
      const token = jwt.sign(
        { id: user.idUtilisateur, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      //  Renvoi du rôle pour le frontend + middleware RBAC
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    connection.query(
      'SELECT * FROM Utilisateur WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0)
          return res.status(404).json({ message: 'Aucun compte trouvé' });

        const token = crypto.randomBytes(32).toString('hex');
        const expire = new Date(Date.now() + 15 * 60 * 1000);

        connection.query(
          'UPDATE Utilisateur SET resetToken=?, resetTokenExpire=? WHERE email=?',
          [token, expire, email],
          async (err) => {
            if (err) return res.status(500).json({ message: 'Erreur SQL' });

            try {
              const resetLink = `http://localhost:3000/reset-password/${token}`;

              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
                }
              });

              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Réinitialisation du mot de passe - EduLearn",
                html: `
                  <div style="font-family: Arial, sans-serif;">
                    <h2>Réinitialisation de mot de passe</h2>
                    <p>Cliquez sur le lien pour réinitialiser :</p>
                    <a href="${resetLink}" style="color: blue;">${resetLink}</a>
                    <p><small>Ce lien expirera dans 15 minutes.</small></p>
                  </div>
                `
              });

              console.log(`Email envoyé à: ${email}`);
              res.json({ message: "Email envoyé !" });

            } catch (emailError) {
              console.error('Erreur envoi email:', emailError);
              res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error('Erreur générale:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


const verifyResetToken = (req, res) => {
  const { token } = req.params;

  connection.query(
    'SELECT * FROM Utilisateur WHERE resetToken = ? AND resetTokenExpire > NOW()',
    [token],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });

      if (results.length === 0)
        return res.status(400).json({ message: 'Token invalide ou expiré' });

      res.json({ message: 'Token valide' });
    }
  );
};

const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  connection.query(
    'SELECT * FROM Utilisateur WHERE resetToken = ? AND resetTokenExpire > NOW()',
    [token],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });

      if (results.length === 0)
        return res.status(400).json({ message: 'Token invalide ou expiré' });

      const hashed = await bcrypt.hash(newPassword, 10);

      connection.query(
        'UPDATE Utilisateur SET motDePasse=?, resetToken=NULL, resetTokenExpire=NULL WHERE resetToken=?',
        [hashed, token],
        (err) => {
          if (err) return res.status(500).json({ message: 'Erreur SQL' });

          res.json({ message: 'Mot de passe mis à jour' });
        }
      );
    }
  );
};

const logout = (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};


module.exports = {
  register,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  logout
};