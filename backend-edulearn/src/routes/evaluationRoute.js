// routes/evaluationRoute.js
const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/authMiddleware');


// ==================== ROUTES ÉTUDIANT ====================
router.get('/student/evaluations', auth, evaluationController.getEvaluationsForStudent);
router.get('/student/evaluations/:id', auth, evaluationController.getEvaluationById);
router.post('/student/evaluations/:id/submit', auth, evaluationController.submitEvaluation);
router.get('/student/evaluation-results', auth, evaluationController.getStudentEvaluationResults);
router.get('/student/evaluation-stats', auth, evaluationController.getEvaluationStats);
router.get('/student/evaluations/course/:coursId', auth, evaluationController.getEvaluationsByCourse);

// ==================== ROUTES ENSEIGNANT ====================
router.post('/teacher/evaluations', auth, evaluationController.createEvaluation);
router.get('/teacher/evaluations', auth, evaluationController.getTeacherEvaluations);
router.get('/teacher/evaluations/:id', auth, evaluationController.getEvaluationDetailsForTeacher);
router.post('/teacher/evaluations/:id/questions', auth, evaluationController.addQuestionToEvaluation);
router.get('/teacher/evaluations/:id/results', auth, evaluationController.getEvaluationResultsDetails);
router.get('/teacher/evaluation-stats', auth, evaluationController.getTeacherEvaluationStats);

module.exports = router;