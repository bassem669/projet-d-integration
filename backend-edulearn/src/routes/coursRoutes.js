const express = require('express');
const router = express.Router();
const coursController = require('../controllers/coursController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public
router.get('/', coursController.getAllCours);
router.get('/enseignant/:idUtilisateur', coursController.getCoursByEnseignant);
router.get('/:id', coursController.getCoursById);

// Protected (create/update/delete)
router.post('/', auth, upload.single('support'), coursController.createCours);
router.put('/:id', auth, upload.single('support'), coursController.updateCours);
router.delete('/:id', auth, coursController.deleteCours);

router.get('/:id/download', auth, coursController.downloadCours);

module.exports = router;
