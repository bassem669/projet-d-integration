// src/pages/admin/Backup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from './../../services/apiConfig';

export default function Backup() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    lastBackup: '',
    totalSize: '0 Go',
  });

  // Récupérer l'historique des sauvegardes
  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/backup/history', {
        headers: getAuthHeaders()
      });
      setBackups(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des sauvegardes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (backupsData) => {
    if (!backupsData || backupsData.length === 0) {
      setStats({
        total: 0,
        lastBackup: 'Aucune',
        totalSize: '0 Go',
      });
      return;
    }

    const total = backupsData.length;
    const lastBackup = backupsData[0]?.dateBackup || 'Aucune';
    
    // Calculer la taille totale (supposons que taille est en bytes)
    const totalBytes = backupsData.reduce((sum, backup) => {
      const sizeStr = backup.taille || '0 bytes';
      const bytes = parseInt(sizeStr) || 0;
      return sum + bytes;
    }, 0);
    
    const totalSize = formatFileSize(totalBytes);
    
    setStats({
      total,
      lastBackup: lastBackup !== 'Aucune' ? formatDate(lastBackup) : 'Aucune',
      totalSize,
    });
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Créer une sauvegarde
  const createBackup = async () => {
    try {
      setCreatingBackup(true);
      const response = await axios.post('http://localhost:5000/api/admin/backup', {}, {
        headers: getAuthHeaders()
      });
      
      // Recharger l'historique
      await fetchBackups();
      alert('Sauvegarde créée avec succès!');
    } catch (err) {
      setError('Erreur lors de la création de la sauvegarde');
      console.error('Erreur:', err);
    } finally {
      setCreatingBackup(false);
    }
  };

  // Télécharger une sauvegarde
  async function downloadBackup(idBackup, filename) {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/backup/${idBackup}`,
      {
        responseType: "blob", // OBLIGATOIRE pour télécharger un fichier
      }
    );

    // Création du lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("Erreur lors du téléchargement :", error);
  }
}

  // Restaurer une sauvegarde
  const restoreBackup = async (backupId, filename) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir restaurer la sauvegarde ${filename} ? Cette action est irréversible.`)) {
      return;
    }
    
    try {
      // Implémentez la restauration selon votre API
      alert(`Restauration de ${filename} - À implémenter`);
    } catch (err) {
      setError('Erreur lors de la restauration');
      console.error('Erreur:', err);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des sauvegardes...</div>;
  }

  return (
    <>
      <h1 className="admin-page-title">Sauvegarde & Restauration</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      {/* Stats rapides */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.total}</div>
          <div className="admin-stat-label">Sauvegardes totales</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.lastBackup}</div>
          <div className="admin-stat-label">Dernière sauvegarde</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalSize}</div>
          <div className="admin-stat-label">Taille totale</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.frequency}</div>
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
          onClick={createBackup}
          disabled={creatingBackup}
        >
          {creatingBackup ? 'Création en cours...' : 'Sauvegarder maintenant'}
        </button>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>
          La sauvegarde sera stockée sur le serveur sécurisé
        </p>
      </div>

      {/* Historique des sauvegardes */}
      <div className="admin-table-container">
        <h2>Historique des sauvegardes</h2>
        
        {backups.length === 0 ? (
          <p className="no-data">Aucune sauvegarde disponible</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Taille</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(backup => (
                <tr key={backup.idBackup}>
                  <td>
                    {backup.dateBackup ? formatDate(backup.dateBackup) : 'N/A'}
                  </td>
                  <td>{backup.type || 'Automatique'}</td>
                  <td>
                    {backup.taille ? formatFileSize(parseInt(backup.taille) || 0) : 'N/A'}
                  </td>
                  <td>
                    <span className={`status-badge ${
                      backup.statut === 'Terminée' ? 'status-active' : 
                      backup.statut === 'En cours' ? 'status-pending' : 'status-rejected'
                    }`}>
                      {backup.statut || 'Inconnu'}
                    </span>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
        <strong>Sécurité :</strong> Toutes les sauvegardes sont chiffrées et stockées sur le serveur.
        Restauration possible en cas d'incident.
      </div>
    </>
  );
}