import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import logo from "../assets/logo_edu.png";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Récupère l'utilisateur depuis le localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔥 Correction complète
  const navigateTo = () => {
    if (!user) return;

    const role = user.role;

    if (role === "enseignant") {
      navigate("/teacher-dashboard");
    } 
    else if (role === "etudiant") {
      navigate("/dashboard");
    } 
    else if (role === "admin") {
      navigate("/admin");
    }
  };

  return (
    <nav className="home-nav">
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="home-logo" />
        </Link>
      </div>

      <div className="nav-right">
        <div className="nav-links-main">
          <Link to="/contact">Contact</Link>
        </div>

        <div
          className="nav-dropdown"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {user ? (
            <>
              <button className="dropbtn">
                <FaUser style={{ marginRight: "8px" }} /> Compte ▼
              </button>

              {dropdownOpen && (
                <div className="dropdown-content">
                  {/* 🔥 Correction : bouton, pas Link */}
                  <button
                    onClick={navigateTo}
                    className="dropdown-btn"
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    Profil
                  </button>

                  <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt style={{ marginRight: "8px" }} /> Déconnexion
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button className="dropbtn">Compte ▼</button>
              <div className="dropdown-content">
                <Link to="/login">Connexion</Link>
                <Link to="/register">Inscription</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
