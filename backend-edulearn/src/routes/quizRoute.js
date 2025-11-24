const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/authMiddleware');

// ==================== ROUTES ÉTUDIANT ====================
router.get('/student/quizzes', auth, quizController.getQuizForStudent);
router.get('/student/quizzes/:id', auth, quizController.getQuizById);
router.post('/student/quizzes/:id/submit', auth, quizController.submitQuiz);
router.get('/student/results', auth, quizController.getQuizResults);

// ==================== ROUTES ENSEIGNANT ====================
router.post('/teacher/quizzes', auth, quizController.createQuiz);
router.get('/teacher/quizzes', auth, quizController.getTeacherQuizzes);
router.get('/teacher/quizzes/:id', auth, quizController.getQuizDetailsForTeacher);
router.put('/teacher/quizzes/:id', auth, quizController.updateQuiz);
router.delete('/teacher/quizzes/:id', auth, quizController.deleteQuiz);
router.post('/teacher/quizzes/:id/questions', auth, quizController.addQuestionToQuiz);
router.get('/teacher/quizzes/:id/results', auth, quizController.getQuizResultsDetails);

module.exports = router;