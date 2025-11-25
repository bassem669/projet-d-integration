const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Existing function
const sendResetEmail = async (email, code) => {
  const mailOptions = {
    from: `"Votre Application" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Code : <strong>${code}</strong></p>
      <p>Expire dans 30 minutes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à: ${email}`);
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

const sendSecurityAlert = async (to, subject, message) => {
  const mailOptions = {
    from: `"Security Alert" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: `
      <h2>🚨 Alerte Sécurité</h2>
      <p>${message}</p>
      <hr>
      <small>Envoyé automatiquement - Ne pas répondre.</small>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alerte sécurité envoyée: ${to}`);
  } catch (error) {
    console.error('Erreur envoi alerte sécurité:', error);
  }
};

module.exports = { sendResetEmail, sendSecurityAlert };
