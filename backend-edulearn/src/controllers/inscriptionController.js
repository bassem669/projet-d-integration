const connection = require('../config/db');

exports.inscrireAuCours = (req, res) => {
  const { idCours } = req.body;
  const idEtudiant = req.user.id;

  // Vérifier si l'utilisateur est un étudiant
  if (req.user.role !== 'etudiant') {
    return res.status(403).json({ message: 'Réservé aux étudiants' });
  }

  connection.query(
    'SELECT * FROM Inscription WHERE idEtudiant = ? AND idCours = ?',
    [idEtudiant, idCours],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Déjà inscrit à ce cours' });
      }

      connection.query(
        'INSERT INTO Inscription (idEtudiant, idCours) VALUES (?, ?)',
        [idEtudiant, idCours],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
          res.status(201).json({ message: 'Inscription réussie' });
        }
      );
    }
  );
};

exports.getMesCoursInscrits = (req, res) => {
  const idEtudiant = req.user.id;

  connection.query(
    `SELECT c.*, u.nom AS nomEnseignant, cl.nomClasse
     FROM Cours c
     JOIN Inscription i ON c.idCours = i.idCours
     LEFT JOIN Utilisateur u ON c.idUtilisateur = u.idUtilisateur
     LEFT JOIN Classe cl ON c.idClasse = cl.idClasse
     WHERE i.idEtudiant = ?`,
    [idEtudiant],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json(results);
    }
  );
};