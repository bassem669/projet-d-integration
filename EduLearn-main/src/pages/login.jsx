import React, { useState } from "react";
import logo from "../assets/logo_edu.png";
import illustration from "../assets/grad.jpg";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import '../pages/login.css';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
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

  const handleSubmit = (e) => {
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

    loginFun();
   

    // console.log("Login with:", { email, password });
    // handleToast("Connexion réussie !", "success");

    // reset
    // setEmail("");
    // setPassword("");
  };

  const loginFun = async () => {
     try {
      const response = await fetch("http://localhost:3005/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email : email, motDePasse: password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        handleToast(data.message || "Erreur de connexion", "error");
        return;
      }

      handleToast(data.message || "Connexion réussie !", "success");

      // Stocker l'utilisateur si besoin
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirection
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      handleToast("Erreur de serveur", "error");
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
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Pas de compte ? <Link to="/register">Créer un compte</Link>
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

export default Login;
