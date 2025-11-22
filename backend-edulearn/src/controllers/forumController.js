const connection = require('./db');

// Créer un nouveau message dans le forum
exports.createMessage = (req, res) => {
  const { contenu, idUtilisateur } = req.body;
  
  if (!contenu || !idUtilisateur) {
    return res.status(400).json({
      error: 'Le contenu du message et l\'ID utilisateur sont requis'
    });
  }

  const query = `
    INSERT INTO Forum (contenu, datePublication, idUtilisateur) 
    VALUES (?, CURDATE(), ?)
  `;

  connection.query(query, [contenu, idUtilisateur], (err, results) => {
    if (err) {
      console.error('Erreur lors de la création du message:', err);
      return res.status(500).json({
        error: 'Erreur serveur lors de la création du message'
      });
    }

    res.status(201).json({
      message: 'Message créé avec succès',
      idMessage: results.insertId
    });
  });
};

// Récupérer tous les messages du forum avec les informations des utilisateurs
exports.getAllMessages = (req, res) => {
  const query = `
    SELECT 
      f.idMessage,
      f.contenu,
      f.datePublication,
      f.created_at,
      f.updated_at,
      u.idUtilisateur,
      u.nom,
      u.prenom,
      u.email,
      u.role,
      u.profilePicture
    FROM Forum f
    LEFT JOIN Utilisateur u ON f.idUtilisateur = u.idUtilisateur
    ORDER BY f.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages:', err);
      return res.status(500).json({
        error: 'Erreur serveur lors de la récupération des messages'
      });
    }

    res.status(200).json({
      messages: results,
      count: results.length
    });
  });
};

// Récupérer un message spécifique par son ID
exports.getMessageById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      f.idMessage,
      f.contenu,
      f.datePublication,
      f.created_at,
      f.updated_at,
      u.idUtilisateur,
      u.nom,
      u.prenom,
      u.email,
      u.role,
      u.profilePicture
    FROM Forum f
    LEFT JOIN Utilisateur u ON f.idUtilisateur = u.idUtilisateur
    WHERE f.idMessage = ?
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du message:', err);
      return res.status(500).json({
        error: 'Erreur serveur lors de la récupération du message'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Message non trouvé'
      });
    }

    res.status(200).json({
      message: results[0]
    });
  });
};

// Mettre à jour un message
exports.updateMessage = (req, res) => {
  const { id } = req.params;
  const { contenu, idUtilisateur } = req.body;

  if (!contenu) {
    return res.status(400).json({
      error: 'Le contenu du message est requis'
    });
  }

  // Vérifier d'abord si le message existe et appartient à l'utilisateur
  const checkQuery = 'SELECT * FROM Forum WHERE idMessage = ? AND idUtilisateur = ?';
  
  connection.query(checkQuery, [id, idUtilisateur], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification du message:', err);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Message non trouvé ou vous n\'êtes pas autorisé à le modifier'
      });
    }

    // Mettre à jour le message
    const updateQuery = `
      UPDATE Forum 
      SET contenu = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE idMessage = ?
    `;

    connection.query(updateQuery, [contenu, id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du message:', err);
        return res.status(500).json({
          error: 'Erreur serveur lors de la mise à jour du message'
        });
      }

      res.status(200).json({
        message: 'Message mis à jour avec succès'
      });
    });
  });
};

// Supprimer un message
exports.deleteMessage = (req, res) => {
  const { id } = req.params;
  const { idUtilisateur, role } = req.body;

  let checkQuery = 'SELECT * FROM Forum WHERE idMessage = ?';
  let queryParams = [id];

  // Si l'utilisateur n'est pas admin, vérifier qu'il est propriétaire du message
  if (role !== 'admin') {
    checkQuery += ' AND idUtilisateur = ?';
    queryParams.push(idUtilisateur);
  }

  connection.query(checkQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification du message:', err);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Message non trouvé ou vous n\'êtes pas autorisé à le supprimer'
      });
    }

    // Supprimer le message
    const deleteQuery = 'DELETE FROM Forum WHERE idMessage = ?';
    
    connection.query(deleteQuery, [id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression du message:', err);
        return res.status(500).json({
          error: 'Erreur serveur lors de la suppression du message'
        });
      }

      res.status(200).json({
        message: 'Message supprimé avec succès'
      });
    });
  });
};

// Récupérer les messages d'un utilisateur spécifique
exports.getUserMessages = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      f.idMessage,
      f.contenu,
      f.datePublication,
      f.created_at,
      f.updated_at,
      u.idUtilisateur,
      u.nom,
      u.prenom,
      u.email,
      u.role
    FROM Forum f
    LEFT JOIN Utilisateur u ON f.idUtilisateur = u.idUtilisateur
    WHERE f.idUtilisateur = ?
    ORDER BY f.created_at DESC
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages utilisateur:', err);
      return res.status(500).json({
        error: 'Erreur serveur lors de la récupération des messages'
      });
    }

    res.status(200).json({
      messages: results,
      count: results.length
    });
  });
};


