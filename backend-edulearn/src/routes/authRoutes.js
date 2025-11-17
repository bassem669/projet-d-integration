const express = require('express');
const router = express.Router();
const { register, 
        login, 
        forgotPassword, 
        verifyResetToken , 
        resetPassword, 
        logout 

} = require('../controllers/authController');

const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/reset/:token', verifyResetToken);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

module.exports = router;
