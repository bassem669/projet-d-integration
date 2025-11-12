const connection = require('../config/db');

//  Ajouter un contact
exports.createContact = (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  const query = `
      INSERT INTO Contact (nom, email, message)
      VALUES (?, ?, ?)
  `;

  connection.query(query, [nom, email, message], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout d'un contact :", err);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
    res.status(201).json({ message: "Message envoyé avec succès." });
  });
};

//  Récupérer tous les contacts
exports.getContacts = (req, res) => {
  const query = `SELECT * FROM Contact ORDER BY created_at DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des contacts :", err);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
    res.status(200).json(results);
  });
};

//  Supprimer un contact
exports.deleteContact = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM Contact WHERE idContact = ?`;

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression du contact :", err);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact introuvable." });
    }

    res.status(200).json({ message: "Contact supprimé avec succès." });
  });
};
