// src/pages/admin/CourseModeration.jsx
import React from 'react';

export default function CourseModeration() {
  return (
    <>
      <h1 className="admin-page-title">Modération des cours</h1>

      <div className="admin-stats-grid">
        <div className="admin-stat-card"><div className="admin-stat-value">89</div><div className="admin-stat-label">En attente</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">423</div><div className="admin-stat-label">Validés</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">12</div><div className="admin-stat-label">Refusés</div></div>
      </div>

      <div className="admin-table-container">
        <h2>Cours en attente de validation</h2>
        <table className="admin-table">
          <thead><tr><th>Titre</th><th>Enseignant</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            <tr>
              <td>Intelligence Artificielle Avancée</td><td>Pr. Martin</td><td>18/11/2025</td>
              <td>
                <button className="admin-btn btn-validate">Valider</button>
                <button className="admin-btn btn-reject">Refuser</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}