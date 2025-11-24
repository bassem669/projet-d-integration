// routes/statsRoute.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');

// Routes étudiant
router.get('/student/:idEtudiant', auth, statsController.getStudentStats);

// Routes enseignant
router.get('/teacher/:idEnseignant', auth, statsController.getTeacherStats);

// Routes admin
router.get('/admin/dashboard', auth, statsController.getAdminDashboardStats);

module.exports = router;