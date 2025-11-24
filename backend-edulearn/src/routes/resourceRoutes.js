const express = require('express');
const router = express.Router();
const {
  getResourcesByCourse,
  addResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const auth = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require("../middleware/upload"); // Import corrigé

// GET /api/resources/:courseId - Récupérer les ressources d'un cours
router.get('/:courseId', auth, getResourcesByCourse);

// POST /api/resources - Ajouter une ressource (avec fichier)
router.post('/', 
  auth, 
  upload.single("file"), 
  handleMulterError, // Middleware de gestion d'erreurs Multer
  addResource
);

// PUT /api/resources/:id - Modifier une ressource (sans fichier)
router.put('/:id', auth, updateResource);

// DELETE /api/resources/:id - Supprimer une ressource
router.delete('/:id', auth, deleteResource);

module.exports = router;