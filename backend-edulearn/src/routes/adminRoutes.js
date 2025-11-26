const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const audit = require('../middleware/auditMiddleware');

// ===================== USERS =====================
router.get(
  '/users',
  auth,
  role(['admin']),
  audit('Liste utilisateurs'),
  adminController.getAllUsers
);

router.put(
  '/users/:id/role',
  auth,
  role(['admin']),
  audit('Maj rôle utilisateur'),
  adminController.updateUserRole
);

router.put(
  '/users/:id/status',
  auth,
  role(['admin']),
  audit('Maj statut utilisateur'),
  adminController.toggleUserStatus
);

router.delete("/users/:id", 
  auth,
  role(['admin']),
  audit('delete utilisateur'),
  adminController.deleteUser
);
// ===================== COURSES =====================
router.get(
  '/courses',
  auth,
  role(['admin']),
  audit('Cours en attente'),
  adminController.getCourses
);

router.put(
  '/courses/:courseId/status',
  auth,
  role(['admin']),
  audit('Changement statut cours'),
  adminController.updateCourseStatus  // <-- sans ()
);


// ===================== LOGS =====================
router.get(
  '/logs',
  auth,
  role(['admin']),
  audit('Consultation logs'),
  adminController.getAdminLogs
);

// ===================== BACKUP =====================
router.post(
  '/backup',
  auth,
  role(['admin']),
  audit('Création backup'),
  adminController.createBackup
);

router.get(
  '/backup/history',
  auth,
  role(['admin']),
  audit('Historique backups'),
  adminController.getBackupsHistory
);



// ===================== SECURITY =====================
router.get(
  '/security',
  auth,
  role(['admin']),
  audit('Statut sécurité'),
  adminController.getSecurityStatus
);

module.exports = router;
