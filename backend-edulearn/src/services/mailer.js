const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2744fab7cf7da7",   
    pass: "4fa1e40bb5f8ab"    
  }
});

async function sendSecurityAlert(to, subject, message) {
  try {
    const info = await transport.sendMail({
      from: "security@EduLearn.com",
      to, 
      subject,
      text: message
    });
    console.log("Security alert sent:", info.messageId);
  } catch (err) {
    console.error("Error sending security alert:", err);
  }
}

module.exports = { sendSecurityAlert };
