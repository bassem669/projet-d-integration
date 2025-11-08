const connection = require('../config/db');

exports.getResourcesByCourse = (req, res) => {
  const { courseId } = req.params;

  connection.query(
    `SELECT r.*, c.titre AS titreCours
     FROM Resources r
     JOIN Cours c ON r.courseId = c.idCours
     WHERE r.courseId = ?`,
    [courseId],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des ressources :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

exports.addResource = (req, res) => {
  const { courseId, type, url } = req.body;

  if (!courseId || !type || !url) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  connection.query(
    'INSERT INTO Resources (courseId, type, url) VALUES (?, ?, ?)',
    [courseId, type, url],
    (err) => {
      if (err) {
        console.error('Erreur lors de l’ajout de la ressource :', err);
        return res.status(500).json({ message: 'Erreur lors de l’ajout de la ressource' });
      }
      res.status(201).json({ message: 'Ressource ajoutée avec succès' });
    }
  );
};

exports.deleteResource = (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM Resources WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Erreur lors de la suppression :', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
    res.json({ message: 'Ressource supprimée avec succès' });
  });
};

exports.updateResource = (req, res) => {
  const { id } = req.params;
  const { type, url } = req.body;

  connection.query(
    'UPDATE Resources SET type=?, url=? WHERE id=?',
    [type, url, id],
    (err) => {
      if (err) {
        console.error('Erreur lors de la mise à jour :', err);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
      }
      res.json({ message: 'Ressource mise à jour avec succès' });
    }
  );
};
