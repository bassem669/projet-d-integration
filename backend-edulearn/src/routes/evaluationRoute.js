const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/authMiddleware');
const { uploadEvaluation } = require('../config/multer');

// Routes pour étudiants
router.get('/pdf', auth, evaluationController.getEvaluationsPDFForStudent);
router.get('/pdf/:id', auth, evaluationController.getEvaluationPDFById);
router.get('/pdf/:id/download', auth, evaluationController.downloadEvaluationPDF);

// Routes pour enseignants
router.post('/pdf', auth, uploadEvaluation.single('fichier'), evaluationController.createEvaluationPDF);
router.get('/pdf/teacher/all', auth, evaluationController.getTeacherEvaluationsPDF);
router.get('/pdf/teacher/:id', auth, evaluationController.getEvaluationPDFDetails);
router.put('/pdf/teacher/:id', auth, uploadEvaluation.single('fichier'), evaluationController.updateEvaluationPDF);
router.delete('/pdf/teacher/:id', auth, evaluationController.deleteEvaluationPDF);
router.get('/pdf/teacher/stats', auth, evaluationController.getTeacherPDFStats);

module.exports = router;