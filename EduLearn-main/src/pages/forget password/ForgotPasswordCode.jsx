import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import './ForgetPassword.css';

const ForgotPasswordCode = () => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      window.location.href = '/forgot-password/new';
    } else {
      alert('Veuillez entrer un code à 6 chiffres.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-image">
          <img src={illustration} alt="Illustration" />
        </div>
        <div className="auth-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Vérification du code</h2>
          <p>Un code à 6 chiffres a été envoyé à votre e-mail.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem' }}
              required
            />
            <button type="submit">Vérifier</button>
          </form>
          <p>
            Vous n'avez pas reçu le code ? <a href="#">Renvoyer</a>
          </p>
          <p>
            <Link to="/forgot-password">Retour</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordCode;