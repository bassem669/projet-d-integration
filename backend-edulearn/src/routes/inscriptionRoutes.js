const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscriptionController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, inscriptionController.inscrireAuCours);
router.get('/mes-cours', authMiddleware, inscriptionController.getMesCoursInscrits);

module.exports = router;