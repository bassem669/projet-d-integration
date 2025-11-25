// src/pages/admin/LogsAudit.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from './../../services/apiConfig';

export default function LogsAudit() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    ip: '',
    dateFrom: '',
    dateTo: ''
  });

  // Récupérer les logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/logs', {
        headers: getAuthHeaders()
      });
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des logs');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres
  useEffect(() => {
    let filtered = logs;

    if (filters.user) {
      filtered = filtered.filter(log => 
        log.adminId?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action?.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    if (filters.ip) {
      filtered = filtered.filter(log => 
        log.ip?.includes(filters.ip)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => {
        if (!log.date_action) return false;
        const logDate = new Date(log.date_action);
        const fromDate = new Date(filters.dateFrom);
        return logDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => {
        if (!log.date_action) return false;
        const logDate = new Date(log.date_action);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // Fin de journée
        return logDate <= toDate;
      });
    }

    setFilteredLogs(filtered);
  }, [logs, filters]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      user: '',
      action: '',
      ip: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Obtenir les valeurs uniques pour les suggestions
  const uniqueUsers = [...new Set(logs.map(log => log.adminId).filter(Boolean))];
  const uniqueActions = [...new Set(logs.map(log => log.action).filter(Boolean))];
  const uniqueIPs = [...new Set(logs.map(log => log.ip).filter(Boolean))];

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des logs...</div>;
  }

  return (
    <>
      <h1 className="admin-page-title">Logs & Audit</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      {/* Filtres */}
      <div className="admin-filters-container">
        <div className="filter-group">
          <label>Utilisateur:</label>
          <input
            type="text"
            placeholder="Filtrer par utilisateur..."
            value={filters.user}
            onChange={(e) => setFilters({...filters, user: e.target.value})}
            className="filter-input"
            list="userSuggestions"
          />
          <datalist id="userSuggestions">
            {uniqueUsers.map(user => (
              <option key={user} value={user} />
            ))}
          </datalist>
        </div>

        <div className="filter-group">
          <label>Action:</label>
          <input
            type="text"
            placeholder="Filtrer par action..."
            value={filters.action}
            onChange={(e) => setFilters({...filters, action: e.target.value})}
            className="filter-input"
            list="actionSuggestions"
          />
          <datalist id="actionSuggestions">
            {uniqueActions.map(action => (
              <option key={action} value={action} />
            ))}
          </datalist>
        </div>

        <div className="filter-group">
          <label>IP:</label>
          <input
            type="text"
            placeholder="Filtrer par IP..."
            value={filters.ip}
            onChange={(e) => setFilters({...filters, ip: e.target.value})}
            className="filter-input"
            list="ipSuggestions"
          />
          <datalist id="ipSuggestions">
            {uniqueIPs.map(ip => (
              <option key={ip} value={ip} />
            ))}
          </datalist>
        </div>

        <div className="filter-group">
          <label>Du:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Au:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="filter-input"
          />
        </div>

        <button 
          onClick={resetFilters}
          className="admin-btn btn-secondary"
          style={{ alignSelf: 'flex-end' }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{filteredLogs.length}</div>
          <div className="admin-stat-label">Logs filtrés</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{logs.length}</div>
          <div className="admin-stat-label">Total logs</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {uniqueUsers.length}
          </div>
          <div className="admin-stat-label">Utilisateurs uniques</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {uniqueIPs.length}
          </div>
          <div className="admin-stat-label">IPs uniques</div>
        </div>
      </div>

      <div className="admin-table-container">
        <h2>
          Historique des actions critiques
          <span className="course-count"> ({filteredLogs.length} résultats)</span>
        </h2>
        
        {filteredLogs.length === 0 ? (
          <p className="no-data">
            {logs.length === 0 ? 'Aucun log disponible' : 'Aucun log ne correspond aux filtres'}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>IP</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id_log}>
                  <td>
                    {log.date_action 
                      ? new Date(log.date_action).toLocaleDateString('fr-FR') + ' ' + 
                        new Date(log.date_action).toLocaleTimeString('fr-FR')
                      : 'N/A'
                    }
                  </td>
                  <td>{log.adminId || 'N/A'}</td>
                  <td>{log.action || 'N/A'}</td>
                  <td>{log.ip || 'N/A'}</td>
                  <td>{log.action || 'Aucun détail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}