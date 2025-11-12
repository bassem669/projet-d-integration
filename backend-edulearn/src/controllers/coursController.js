const connection = require('../config/db');

exports.getAllCours = (req, res) => {
  connection.query(
    `SELECT c.*, u.nom AS nomUtilisateur, cl.nomClasse 
     FROM Cours c
     LEFT JOIN Utilisateur u ON c.idUtilisateur = u.idUtilisateur
     LEFT JOIN Classe cl ON c.idClasse = cl.idClasse`,
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des cours :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

exports.createCours = (req, res) => {
  const { titre, description, support, DateCours, idClasse, idUtilisateur } = req.body;

  if (!titre || !idUtilisateur) {
    return res.status(400).json({ message: 'Titre et idUtilisateur sont requis' });
  }

  connection.query(
    'INSERT INTO Cours (titre, description, support, DateCours, idClasse, idUtilisateur) VALUES (?, ?, ?, ?, ?, ?)',
    [titre, description, support, DateCours, idClasse, idUtilisateur],
    (err, result) => {
      if (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({ message: 'Erreur lors de l’ajout du cours' });
      }
      res.status(201).json({ message: 'Cours ajouté avec succès', id: result.insertId });
    }
  );
};


exports.getCoursById = (req, res) => {
  const { id } = req.params;
  connection.query(
    'SELECT * FROM Cours WHERE idCours = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      if (results.length === 0) return res.status(404).json({ message: 'Cours introuvable' });
      res.json(results[0]);
    }
  );
};

exports.updateCours = (req, res) => {
  const { id } = req.params;
  const { titre, description, support, DateCours, idClasse } = req.body;

  connection.query(
    'UPDATE Cours SET titre=?, description=?, support=?, DateCours=?, idClasse=? WHERE idCours=?',
    [titre, description, support, DateCours, idClasse, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
      res.json({ message: 'Cours mis à jour avec succès' });
    }
  );
};

exports.deleteCours = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Cours WHERE idCours = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la suppression' });
    res.json({ message: 'Cours supprimé avec succès' });
  });
};
