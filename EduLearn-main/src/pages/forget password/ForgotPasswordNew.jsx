import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    if (hasError) return handleToast("Corrige les erreurs", "error");

    handleToast("Mot de passe mis à jour !", "success");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-image">
          <img src={illustration} alt="Illustration" />
        </div>

        <div className="auth-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Nouveau mot de passe</h2>
          <p>Choisissez un mot de passe sécurisé.</p>

          <form onSubmit={handleSubmit}>

            {/* Champ 1 */}
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

            <button type="submit" className="submit-btn">Réinitialiser</button>
          </form>

          <p className="link-back">
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ForgotPasswordNew;