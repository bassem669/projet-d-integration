// src/pages/admin/LogsAudit.jsx
import React from 'react';

export default function LogsAudit() {
  return (
    <>
      <h1 className="admin-page-title">Logs & Audit</h1>

      <div className="admin-table-container">
        <h2>Historique des actions critiques</h2>
        <table className="admin-table">
          <thead><tr><th>Date</th><th>Utilisateur</th><th>Action</th><th>IP</th><th>Détails</th></tr></thead>
          <tbody>
            <tr><td>18/11/2025 17:15</td><td>admin@edu.com</td><td>Connexion admin</td><td>192.168.1.45</td><td>JWT validé</td></tr>
            <tr><td>18/11/2025 16:42</td><td>etudiant123</td><td>Tentative connexion échouée (x3)</td><td>105.22.14.8</td><td>Compte bloqué 15 min</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}