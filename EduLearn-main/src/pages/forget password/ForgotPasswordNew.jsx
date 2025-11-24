import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import "./ForgetPassword.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ForgotPasswordNew() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("error");

  const handleToast = (msg, sev = "error") => {
    setToastMessage(msg);
    setToastSeverity(sev);
    setToastOpen(true);
  };

  const handleCloseToast = () => setToastOpen(false);

  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  // Récupérer les informations utilisateur stockées
  useEffect(() => {
    const storedUser = localStorage.getItem('resetUser');
    const storedEmail = localStorage.getItem('resetEmail');
    const storedCode = localStorage.getItem('resetCode');
    
    if (!storedUser || !storedEmail || !storedCode) {
      handleToast("Session invalide ou expirée. Veuillez recommencer la procédure.", "error");
      setTimeout(() => navigate("/forgot-password"), 2000);
    } else {
      setUserInfo(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Nettoyer après 15 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      clearResetData();
      navigate('/forgot-password');
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const clearResetData = () => {
    localStorage.removeItem('resetUser');
    localStorage.removeItem('resetCode');
    localStorage.removeItem('resetEmail');
  };

  const validateForm = () => {
    const newErrors = { password: "", confirmPassword: "" };
    let hasError = false;

    if (password.length < 8) {
      newErrors.password = "8 caractères minimum";
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mots de passe différents";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Récupérer le code et l'email du localStorage
      const resetCode = localStorage.getItem('resetCode');
      const resetEmail = localStorage.getItem('resetEmail');
      
      if (!resetCode || !resetEmail) {
        handleToast("Session expirée. Veuillez recommencer.", "error");
        setTimeout(() => navigate("/forgot-password"), 2000);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        {
          code: resetCode,
          email: resetEmail,
          newPassword: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        handleToast("Mot de passe réinitialisé avec succès !", "success");
        
        // Nettoyer le localStorage
        clearResetData();
        
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => navigate("/login"), 2000);
      } else {
        handleToast(response.data.error || "Erreur lors de la réinitialisation", "error");
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      
      if (error.response) {
        handleToast(error.response.data.error || "Erreur lors de la réinitialisation", "error");
      } else if (error.request) {
        handleToast("Impossible de contacter le serveur. Vérifiez votre connexion.", "error");
      } else {
        handleToast("Erreur de configuration de la requête", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Effacer l'erreur quand l'utilisateur modifie le mot de passe
    if (errors.password && value.length >= 8) {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    // Effacer l'erreur quand l'utilisateur modifie la confirmation
    if (errors.confirmPassword && value === password) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  // Si pas d'infos utilisateur, afficher un message de chargement
  if (!userInfo) {
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
          <h2>Nouveau mot de passe</h2>
          <p>Bonjour {userInfo.prenom}, choisissez un nouveau mot de passe sécurisé.</p>

          <form onSubmit={handleSubmit}>

            {/* Champ mot de passe */}
            <Tooltip title={errors.password} open={!!errors.password} placement="right" arrow>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </Tooltip>

            {/* Champ confirmation mot de passe */}
            <Tooltip
              title={errors.confirmPassword}
              open={!!errors.confirmPassword}
              placement="right"
              arrow
            >
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  disabled={loading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </Tooltip>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Réinitialisation..." : "Réinitialiser"}
            </button>
          </form>

          <p className="link-back">
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>

      <Snackbar 
        open={toastOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ForgotPasswordNew;