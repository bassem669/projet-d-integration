// src/pages/admin/UsersManagement.jsx
import React from 'react';

const UsersManagement = () => {
  return (
    <>
      <h1 className="admin-page-title">Gestion des utilisateurs & rôles</h1>

      {/* Stats rapides */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">1 248</div>
          <div className="admin-stat-label">Total utilisateurs</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">842</div>
          <div className="admin-stat-label">Étudiants</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">386</div>
          <div className="admin-stat-label">Enseignants</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">20</div>
          <div className="admin-stat-label">Admins</div>
        </div>
      </div>

      {/* Tableau complet avec TOUTES les actions US 5.3 */}
      <div className="admin-table-container">
        <h2>Liste des utilisateurs</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Exemple utilisateur actif */}
            <tr>
              <td>1</td>
              <td>Marie Curie</td>
              <td>marie@edu.com</td>
              <td>Enseignant</td>
              <td><span className="status-badge status-active">Actif</span></td>
              <td>12/03/2024</td>
              <td className="actions-cell">
                <button className="admin-btn btn-view">Voir</button>
                <button className="admin-btn btn-edit">Modifier rôle</button>
                <button className="admin-btn btn-reject">Suspendre</button>
              </td>
            </tr>

            {/* Exemple utilisateur suspendu */}
            <tr>
              <td>2</td>
              <td>John Doe</td>
              <td>john@student.com</td>
              <td>Étudiant</td>
              <td><span className="status-badge status-inactive">Suspendu</span></td>
              <td>05/09/2025</td>
              <td className="actions-cell">
                <button className="admin-btn btn-view">Voir</button>
                <button className="admin-btn btn-validate">Réactiver</button>
                <button className="admin-btn btn-delete">Supprimer</button>
              </td>
            </tr>

            {/* Autres exemples */}
            <tr>
              <td>3</td>
              <td>Albert Einstein</td>
              <td>albert@edu.com</td>
              <td>Enseignant</td>
              <td><span className="status-badge status-active">Actif</span></td>
              <td>01/01/2025</td>
              <td className="actions-cell">
                <button className="admin-btn btn-view">Voir</button>
                <button className="admin-btn btn-edit">Modifier rôle</button>
                <button className="admin-btn btn-reject">Suspendre</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Légende des actions (bonus pro) */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #0c4a6e' }}>
        <strong>Icônes d'actions :</strong><br />
        Voir profil • Modifier rôle (admin/enseignant/étudiant) • <span style={{color:'#dc2626'}}>Suspendre</span> (bloque l'accès) • <span style={{color:'#16a34a'}}>Réactiver</span> • <span style={{color:'#991b1b'}}>Supprimer définitivement</span>
      </div>
    </>
  );
};

export default UsersManagement;