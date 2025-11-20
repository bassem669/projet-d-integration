import React, { useState } from "react";
import logo from "../../assets/logo_edu1.png";
import illustration from "../../assets/grad.jpg";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import "./login.css";
import { useNavigate } from 'react-router-dom';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // Erreurs
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };
    let hasError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Format email invalide";
      hasError = true;
    }

    if (password.length < 8) {
      newErrors.password = "Au moins 8 caractères";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      handleToast("Veuillez corriger les erreurs", "error");
      return;
    }

    try {
      const dataLogin = {
        email: email,
        motDePasse: password,
      };

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataLogin),
      });

      const data = await response.json();

      if (!response.ok) {
        handleToast(data.message || "Email ou mot de passe incorrect", "error");
        return;
      }

      handleToast("Connexion réussie !", "success");

      // Stockage du token et des infos utilisateur
      if (data.token) {
        localStorage.setItem("token", data.token); // inutile de JSON.stringify ici si c'est déjà une chaîne
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Reset du formulaire
      setEmail("");
      setPassword("");

      // Gestion de la redirection selon le rôle
      const role = data.user?.role?.toLowerCase();

      if (role === "enseignant") {
        navigate("/teacher-dashboard");
      } else if (role === "etudiant") {
        navigate("/dashboard");
      } else if ("/admin") {
        navigate("/admin"); // par défaut, au cas où le rôle est inconnu
      } else {
        navigate("/");
      }

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
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
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

            <button type="submit">Se connecter</button>
          </form>

          {/* 🌸 Liens sous le formulaire */}
          <div style={{ marginTop: "0.8rem", textAlign: "center", fontSize: "0.9rem" }}>
            <p>
              Pas de compte ?{" "}
              <Link to="/register" style={{ color: "var(--secondary-color)", fontWeight: "bold", textDecoration: "none" }}>
                Créer un compte
              </Link>
            </p>
            <p style={{ marginTop: "0.4rem" }}>
              <Link to="/forgot-password" style={{ color: "var(--secondary-color)", textDecoration: "none" }}>
                Mot de passe oublié ?
              </Link>
            </p>
          </div>
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

export default Login;
