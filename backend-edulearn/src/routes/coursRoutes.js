const express = require('express');
const router = express.Router();
const coursController = require('../controllers/coursController');
const auth = require('../middleware/authMiddleware');     // Vérifie le token
const roleMiddleware = require('../middleware/roleMiddleware');  // Vérifie le rôle
const upload = require('../middleware/upload');

// Public
router.get('/', coursController.getAllCours);
router.get('/enseignant/:idUtilisateur', coursController.getCoursByEnseignant);
router.get('/:id', coursController.getCoursById);

// Protected (create/update/delete)
router.post(
  '/', 
  auth, 
  roleMiddleware(['enseignant', 'admin']), 
  upload.single('support'), 
  coursController.createCours
);

router.put(
  '/:id', 
  auth, 
  roleMiddleware(['enseignant', 'admin']), 
  upload.single('support'), 
  coursController.updateCours
);

router.delete(
  '/:id', 
  auth, 
  roleMiddleware(['admin']), 
  coursController.deleteCours
);

router.get(
  '/:id/download', 
  auth, 
  roleMiddleware(['admin', 'enseignant', 'etudiant']), 
  coursController.downloadCours
);

router.put(
  '/:id/valider',
  auth,
  roleMiddleware(['admin']),
  coursController.validerCours
);

router.put(
  '/:id/refuser',
  auth,
  roleMiddleware(['admin']),
  coursController.refuserCours
);


module.exports = router;
