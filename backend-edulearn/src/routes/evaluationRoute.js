// routes/evaluationRoutes.js
const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

// Middleware d'authentification
const auth = require('../middleware/authMiddleware');

// Appliquer l'authentification à toutes les routes
router.use(auth);

// Routes pour les évaluations
router.get('/', evaluationController.getEvaluationsForStudent);
router.get('/cours/:coursId', evaluationController.getEvaluationsByCourse);
router.get('/resultats/mes-resultats', evaluationController.getStudentEvaluationResults);
router.get('/stats/mes-statistiques', evaluationController.getEvaluationStats);
router.get('/:id', evaluationController.getEvaluationById);  // <--- À LA FIN !
router.post('/:id/soumettre', evaluationController.submitEvaluation);

module.exports = router;