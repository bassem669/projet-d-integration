import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import './ForgetPassword.css';

const ForgotPasswordCode = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Récupérer l'email au montage
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('Aucun email trouvé. Veuillez retourner à la page précédente.');
      setTimeout(() => navigate('/forgot-password'), 2000);
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  // Nettoyer après 15 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      localStorage.removeItem('resetUser');
      navigate('/forgot-password');
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const validateCode = (code) => {
    return /^\d{6}$/.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCode(code)) {
      setError('Veuillez entrer un code à 6 chiffres valide.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-code',
        { 
          code,
          email: localStorage.getItem('resetEmail')
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.valid) {
        // Stocker le code pour l'étape suivante
        localStorage.setItem('resetCode', code);
        
        // Stocker les informations utilisateur
        localStorage.setItem('resetUser', JSON.stringify({
          email: response.data.email,
          prenom: response.data.prenom
        }));
        
        // Rediriger vers la page de nouveau mot de passe
        navigate('/forgot-password/new');
      } else {
        setError(response.data.error || 'Code invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      
      if (error.response) {
        setError(error.response.data.error || 'Erreur lors de la vérification du code');
      } else if (error.request) {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        setError('Erreur de configuration de la requête');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const email = localStorage.getItem('resetEmail');
    
    if (!email) {
      setError('Aucun email trouvé. Veuillez retourner à la page précédente.');
      return;
    }

    setResending(true);
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
        alert('Un nouveau code a été envoyé à votre adresse email.');
      } else {
        setError(response.data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error) {
      console.error('Erreur lors du renvoi du code:', error);
      
      if (error.response) {
        setError(error.response.data.error || 'Erreur lors du renvoi du code');
      } else if (error.request) {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        setError('Erreur de configuration de la requête');
      }
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error && value.length > 0) {
      setError('');
    }
  };

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-form">
            <div className="loading-message">Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-image">
          <img src={illustration} alt="Illustration" />
        </div>
        <div className="auth-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Vérification du code</h2>
          <p>Un code à 6 chiffres a été envoyé à {email}.</p>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              maxLength="6"
              style={{ 
                textAlign: 'center', 
                letterSpacing: '8px', 
                fontSize: '1.2rem',
                fontFamily: 'monospace'
              }}
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || code.length !== 6}
              className={loading ? 'loading' : ''}
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>
          
          <p>
            Vous n'avez pas reçu le code ?{' '}
            <button 
              onClick={handleResendCode}
              disabled={resending}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                textDecoration: 'underline',
                cursor: resending ? 'not-allowed' : 'pointer',
                padding: 0,
                fontSize: 'inherit'
              }}
            >
              {resending ? 'Envoi...' : 'Renvoyer'}
            </button>
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