const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

// Ajouter un contact
router.post('/', contactsController.createContact);

// Récupérer tous les contacts
router.get('/', contactsController.getContacts);

// Supprimer un contact
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
