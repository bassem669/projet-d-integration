// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { getStudentStats } = require('../controllers/statsController');

// Route pour obtenir les statistiques d'un étudiant
router.get('/:idEtudiant', getStudentStats);

module.exports = router;