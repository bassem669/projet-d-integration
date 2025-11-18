// src/pages/admin/Backup.jsx
import React from 'react';

export default function Backup() {
  return (
    <>
      <h1 className="admin-page-title">Sauvegarde & Restauration</h1>

      {/* Stats rapides */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">47</div>
          <div className="admin-stat-label">Sauvegardes totales</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">18/11/2025 03:15</div>
          <div className="admin-stat-label">Dernière sauvegarde</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">2.4 Go</div>
          <div className="admin-stat-label">Taille totale</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">Quotidienne</div>
          <div className="admin-stat-label">Fréquence</div>
        </div>
      </div>

      {/* Bouton principal + actions rapides */}
      <div style={{ 
        background: 'white', 
        padding: '2.5rem', 
        borderRadius: '16px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h2 style={{ margin: '0 0 2rem 0', color: '#1e293b' }}>
          Lancer une sauvegarde complète
        </h2>
        <button 
          className="admin-btn" 
          style={{ 
            background: '#10b981', 
            padding: '1rem 3rem', 
            fontSize: '1.3rem',
            borderRadius: '12px'
          }}
        >
          Sauvegarder maintenant
        </button>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>
          La sauvegarde sera stockée sur le serveur sécurisé (AWS S3 / Google Drive)
        </p>
      </div>

      {/* Historique des sauvegardes */}
      <div className="admin-table-container">
        <h2>Historique des sauvegardes</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Taille</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>18/11/2025 03:15</td>
              <td>Automatique (quotidienne)</td>
              <td>2.4 Go</td>
              <td><span className="status-badge status-active">Terminée</span></td>
              <td>
                <button className="admin-btn btn-view">Télécharger</button>
                <button className="admin-btn btn-edit">Restaurer</button>
              </td>
            </tr>
            <tr>
              <td>17/11/2025 03:15</td>
              <td>Automatique</td>
              <td>2.3 Go</td>
              <td><span className="status-badge status-active">Terminée</span></td>
              <td><button className="admin-btn btn-view">Télécharger</button></td>
            </tr>
            <tr>
              <td>16/11/2025 14:22</td>
              <td>Manuelle (par admin)</td>
              <td>2.4 Go</td>
              <td><span className="status-badge status-active">Terminée</span></td>
              <td><button className="admin-btn btn-view">Télécharger</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info sécurité */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#ecfdf5',
        border: '1px solid #10b981',
        borderRadius: '12px',
        color: '#065f46'
      }}>
        <strong>Sécurité :</strong> Toutes les sauvegardes sont chiffrées AES-256 et stockées hors site.
        Restauration possible en moins de 5 minutes en cas d'incident.
      </div>
    </>
  );
}