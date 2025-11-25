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
router.get('/:id/details', coursController.getCoursDetails); 
// Protected (create/update/delete)
router.post(
  '/', 
  auth, 
  roleMiddleware(['enseignant']), 
  coursController.createCours
);

router.get('/enseignant/:idEnseignant/etudiant', coursController.getEtudiantsByEnseignant);


router.put(
  '/:id', 
  auth, 
  roleMiddleware(['enseignant']), 
  coursController.updateCours
);

router.delete(
  '/:id', 
  auth, 
  roleMiddleware(['enseignant']), 
  coursController.deleteCours
);

router.get(
  '/:id/download', 
  auth, 
  roleMiddleware(['admin', 'enseignant', 'etudiant']), 
  coursController.downloadCours
);


module.exports = router;
