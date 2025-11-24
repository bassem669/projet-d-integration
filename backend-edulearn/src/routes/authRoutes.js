const express = require('express');
const router = express.Router();
const { register, 
        login, 
        réinitialisationMotDePass,
        resetMotDePass,
        verifierCode,
        logout,
        getAllEnseignants 

} = require('../controllers/authController');

const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', réinitialisationMotDePass);
router.post('/verify-code', verifierCode);
router.post('/reset-password', resetMotDePass);
router.post('/logout', logout);
router.get('/enseignants', getAllEnseignants);

module.exports = router;
