import React from 'react';

const AdminDashboard = () => (
  <>
    <h1 className="admin-page-title">Tableau de bord Administrateur</h1>
    <div className="admin-stats-grid">
      <div className="admin-stat-card"><div className="admin-stat-value">1 248</div><div className="admin-stat-label">Utilisateurs actifs</div></div>
      <div className="admin-stat-card"><div className="admin-stat-value">89</div><div className="admin-stat-label">Cours en attente</div></div>
      <div className="admin-stat-card"><div className="admin-stat-value">423</div><div className="admin-stat-label">Cours publiés</div></div>
      <div className="admin-stat-card"><div className="admin-stat-value">3</div><div className="admin-stat-label">Alertes sécurité (24h)</div></div>
    </div>
    <div className="admin-table-container">
      <h2>Activité récente</h2>
      <table className="admin-table">
        <thead><tr><th>ID</th><th>Utilisateur</th><th>Action</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          <tr><td>#2103</td><td>prof.dupont@edu.com</td><td>Soumission cours</td><td>18/11/2025 17:20</td><td><span className="status-badge status-pending">En attente</span></td><td><button className="admin-btn btn-validate">Valider</button> <button className="admin-btn btn-reject">Refuser</button></td></tr>
        </tbody>
      </table>
    </div>
  </>
);

export default AdminDashboard;