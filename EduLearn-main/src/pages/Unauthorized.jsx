import React from "react";
import { Link } from "react-router-dom";
import "./unauthorized.css"; // optionnel pour le style

export default function Unauthorized() {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">⛔ Accès refusé</h1>
      <p className="unauthorized-text">
        Vous n'avez pas l'autorisation d'accéder à cette page.
      </p>

      <Link to="/" className="unauthorized-btn">
        Retourner à l'accueil
      </Link>
    </div>
  );
}
