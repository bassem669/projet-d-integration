// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const { sendSecurityAlert } = require('./emailService.js');

const resetLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 3, // 10 tentatives max
  message: {
    message: 'Trop de tentatives de réinitialisation. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: async (req, res, next, options) => {
    // envoyer une alerte sécurité
    await sendSecurityAlert(
      process.env.EMAIL_USER,
      "Alerte sécurité : trop de tentatives de connexion ont échoués",
      `IP: ${req.ip} a dépassé la limite de tentatives de saisies de mot de passe à ${new Date().toISOString()}`
    );

    // renvoyer la réponse standard
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = { resetLimiter };
