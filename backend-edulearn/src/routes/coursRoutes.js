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
  roleMiddleware(['enseignant', 'admin']), 
  coursController.createCours
);

router.get('/enseignant/:idEnseignant/etudiant', coursController.getEtudiantsByEnseignant);


router.put(
  '/:id', 
  auth, 
  roleMiddleware(['enseignant', 'admin']), 
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

exports.getAdminLogs = (req, res) => {
  connection.query('SELECT * FROM AdminLogs ORDER BY date_action DESC LIMIT 50', (err, results) => {
    if(err) return res.status(500).json({ message: 'Erreur serveur' });
    res.json(results);
  });
};

exports.createBackup = (req, res) => {
  // Simuler une sauvegarde
  res.json({ message: 'Sauvegarde lancée', date: new Date() });
};

exports.getBackupsHistory = (req, res) => {
  // Historique fictif
  const backups = [
    { date: '2025-11-18', type: 'Automatique', taille: '2.4Go', statut: 'Terminée' },
    { date: '2025-11-17', type: 'Automatique', taille: '2.3Go', statut: 'Terminée' }
  ];
  res.json(backups);
};

exports.getSecurityStatus = (req, res) => {
  res.json({
    https: true,
    rateLimit: '100 req/min',
    attemptsBlocked24h: 3
  });
};


module.exports = router;
