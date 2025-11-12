const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

exports.register = (req, res) => {
  const { nom, prenom, email, motDePasse, role } = req.body;

  if (!nom || !prenom || !email || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérifier si l'utilisateur existe déjà
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
          if (err) return res.status(500).json({ message: 'Erreur lors de l’inscription' });
          res.status(201).json({ message: 'Inscription réussie' });
        }
      );
    }
  );
};

exports.login = (req, res) => {
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

      const token = jwt.sign(
        { id: user.idUtilisateur, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ message: 'Connexion réussie', token, user });
    }
  );
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'Déconnexion réussie' });
};
