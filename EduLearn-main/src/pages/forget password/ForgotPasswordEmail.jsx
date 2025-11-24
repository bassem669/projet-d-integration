import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import './ForgetPassword.css';

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Nettoyer les données de réinitialisation au montage
  React.useEffect(() => {
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('resetCode');
    localStorage.removeItem('resetUser');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        // Stocker l'email pour l'utiliser dans la page de vérification du code
        localStorage.setItem('resetEmail', email);
        // Rediriger vers la page du code après un court délai
        setTimeout(() => {
          navigate('/forgot-password/code');
        }, 2000);
      } else {
        setError(response.data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      
      if (error.response) {
        setError(error.response.data.error || 'Erreur lors de la demande de réinitialisation');
      } else if (error.request) {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        setError('Erreur de configuration de la requête');
      }
    } finally {
      setLoading(false);
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
          <h2>Réinitialiser le mot de passe</h2>
          <p>Entrez votre adresse e-mail pour recevoir un code de vérification.</p>
          
          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le code'}
            </button>
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