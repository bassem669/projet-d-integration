const express = require('express');
const audit = require('../middleware/auditMiddleware');
const router = express.Router();
const { register, 
        login, 
        réinitialisationMotDePass,
        resetMotDePass,
        verifierCode,
        logout,
        getAllEnseignants 

} = require('../controllers/authController');

const { resetLimiter } = require('../middleware/rateLimit');
const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', audit('connexion'), resetLimiter, login);
router.post('/forgot-password', resetLimiter, réinitialisationMotDePass);
router.post('/verify-code', resetLimiter, verifierCode);
router.post('/reset-password', resetLimiter, resetMotDePass);
router.post('/logout', logout);
router.get('/enseignants', getAllEnseignants);

module.exports = router;
