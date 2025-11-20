import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import './ForgetPassword.css';

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi
    console.log('Email envoyé à :', email);
    // Rediriger vers la page du code
    window.location.href = '/forgot-password/code';
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-image">
          <img src={illustration} alt="Illustration" />
        </div>
        <div className="auth-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Réinitialiser le mot de passe</h2>
          <p>Entrez votre adresse e-mail pour recevoir un code de vérification.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Envoyer le code</button>
          </form>
          <p>
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;