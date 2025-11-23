import React from 'react';

const AdminDashboard = () => (
  <>
    <h1 className="admin-page-title">Tableau de bord Administrateur</h1>
    <div className="admin-stats-grid">
      <div className="admin-stat-card"><div className="admin-stat-value">1 248</div><div className="admin-stat-label">Utilisateurs actifs</div></div>
      <div className="admin-stat-card"><div className="admin-stat-value">89</div><div className="admin-stat-label">Cours en attente</div></div>
      <div className="admin-stat-card"><div className="admin-stat-value">423</div><div className="admin-stat-label">Cours publiés</div></div>

    </div>
  </>
);

export default AdminDashboard;