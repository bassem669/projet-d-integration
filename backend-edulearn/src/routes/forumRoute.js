const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// Middleware de validation (optionnel)
const validateMessage = (req, res, next) => {
  const { contenu, idUtilisateur } = req.body;
  
  if (!contenu || !idUtilisateur) {
    return res.status(400).json({
      error: 'Le contenu du message et l\'ID utilisateur sont requis'
    });
  }
  
  if (contenu.length > 1000) {
    return res.status(400).json({
      error: 'Le message ne doit pas dépasser 1000 caractères'
    });
  }
  
  next();
};

// Routes pour le forum
router.post('/messages', validateMessage, forumController.createMessage);
router.get('/messages', forumController.getAllMessages);
router.get('/messages/user/:userId', forumController.getUserMessages);
router.get('/messages/:id', forumController.getMessageById);
router.put('/messages/:id', validateMessage, forumController.updateMessage);
router.delete('/messages/:id', forumController.deleteMessage);

module.exports = router;