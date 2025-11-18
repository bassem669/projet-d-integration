// src/pages/admin/SecuritySettings.jsx
import React from 'react';

export default function SecuritySettings() {
  return (
    <>
      <h1 className="admin-page-title">Paramètres de sécurité</h1>

      <div className="admin-stats-grid">
        <div className="admin-stat-card"><div className="admin-stat-value">3</div><div className="admin-stat-label">Tentatives bloquées (24h)</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">HTTPS</div><div className="admin-stat-label">Activé</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">Rate Limit</div><div className="admin-stat-label">100 req/min</div></div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginTop: 0 }}>Actions rapides</h2>
        <button className="admin-btn" style={{ background: '#f59e0b', marginRight: '1rem' }}>Forcer réauthentification tous les utilisateurs</button>
        <button className="admin-btn btn-delete" style={{ marginRight: '1rem' }}>Vider le cache JWT</button>
        <button className="admin-btn" style={{ background: '#10b981' }}>Lancer sauvegarde manuelle</button>
      </div>
    </>
  );
}