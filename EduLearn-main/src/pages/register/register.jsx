import React, { useState } from "react";
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import './register.css';
import { useNavigate } from 'react-router-dom';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Register() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("etudiant");

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("error");

  const handleToast = (message, severity = "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  // Erreurs inline
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { nom: "", prenom: "", email: "", password: "", confirmPassword: "" };
    let hasError = false;

    if (nom.trim().length < 3) {
      newErrors.nom = "Le nom doit contenir au moins 3 lettres";
      hasError = true;
    }

    if (prenom.trim().length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 lettres";
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Format email invalide";
      hasError = true;
    }

    if (password.length < 8) {
      newErrors.password = "Au moins 8 caractères";
      hasError = true;
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // ✅ Envoi au backend avec fetch
    try {
      const registreData = {
        nom : nom, 
        prenom : prenom,
        email : email, 
        motDePasse : password, 
        role : role
      }
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registreData),
      });

      const data = await response.json();

      if (!response.ok) {
        handleToast(data.message || "Erreur lors de l'inscription", "error");
        return;
      }

      handleToast("Inscription réussie !", "success");

      // Reset du formulaire
      setNom("");
      setPrenom("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("etudiant");
      navigate('/login');

    } catch (error) {
      console.error("Erreur:", error);
      handleToast("Erreur réseau ou serveur", "error");
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
          <h2>Inscription</h2>
          <form onSubmit={handleSubmit}>
            <Tooltip title={errors.username} open={!!errors.username} placement="right" arrow>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </Tooltip>

            <Tooltip title={errors.prenom} open={!!errors.prenom} placement="right" arrow>
              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </Tooltip>

            <Tooltip title={errors.email} open={!!errors.email} placement="right" arrow>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Tooltip>

            <Tooltip title={errors.password} open={!!errors.password} placement="right" arrow>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </Tooltip>

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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </Tooltip>

            <div className="toggle-switch">
                <span>Rôle : </span>
                <label className="switch">
                    <input
                    type="checkbox"
                    checked={role === "enseignant"}
                    onChange={() =>
                        setRole(role === "etudiant" ? "enseignant" : "etudiant")
                    }
                    />
                    <span className="slider round"></span>
                </label>
                <span style={{ marginLeft: "0.5rem" }}>
                    {role === "etudiant" ? "Étudiant" : "Enseignant"}
                </span>
                </div>


            <button type="submit">S'inscrire</button>
          </form>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Déjà un compte ? <Link to="/login">Se connecter</Link>
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

export default Register;