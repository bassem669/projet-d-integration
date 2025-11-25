import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from './../../services/apiConfig';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    utilisateurs: {
      total: 0,
      etudiants: 0,
      enseignants: 0,
      admins: 0
    },
    cours: {
      total: 0,
      enAttente: 0,
      valides: 0,
      refuses: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupérer les statistiques du dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/stats/admin/dashboard', {
        headers: getAuthHeaders()
      });
      setStats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="admin-page-title">Tableau de bord Administrateur</h1>
        <div className="loading">Chargement des statistiques...</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-page-title">Tableau de bord Administrateur</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.utilisateurs.total}</div>
          <div className="admin-stat-label">Utilisateurs total</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.utilisateurs.etudiants}</div>
          <div className="admin-stat-label">Étudiants</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.utilisateurs.enseignants}</div>
          <div className="admin-stat-label">Enseignants</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.utilisateurs.admins}</div>
          <div className="admin-stat-label">Administrateurs</div>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.cours.total}</div>
          <div className="admin-stat-label">Cours total</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.cours.enAttente}</div>
          <div className="admin-stat-label">Cours en attente</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.cours.valides}</div>
          <div className="admin-stat-label">Cours publiés</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.cours.refuses}</div>
          <div className="admin-stat-label">Cours refusés</div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;