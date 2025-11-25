// src/pages/admin/UsersManagement.jsx
import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from './../../services/apiConfig';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    teachers: 0,
    admins: 0
  });
  const [filters, setFilters] = useState({
    role: '',
    search: ''
  });

  // Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`http://localhost:5000/api/admin/users?${params}`,{
              headers: getAuthHeaders()
      });
      setUsers(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (usersData) => {
    const total = usersData.length;
    const students = usersData.filter(user => user.role === 'etudiant').length;
    const teachers = usersData.filter(user => user.role === 'enseignant').length;
    const admins = usersData.filter(user => user.role === 'admin').length;
    
    setStats({ total, students, teachers, admins });
  };

  // Modifier le rôle d'un utilisateur
  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },           // Body
        { headers: getAuthHeaders() } // Config (headers)
      );
      
      // Mettre à jour l'état local
      setUsers(users.map(user => 
        user.idUtilisateur === userId ? { ...user, role: newRole } : user
      ));
      
      alert('Rôle mis à jour avec succès');
      fetchUsers(); // Recharger pour mettre à jour les stats
    } catch (err) {
      setError('Erreur lors de la modification du rôle');
      console.error('Error updating role:', err);
    }
  };

  // Basculer le statut d'un utilisateur
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, {
        status: newStatus
      },
      { headers: getAuthHeaders() }
      );
      
      // Mettre à jour l'état local
      setUsers(users.map(user => 
        user.idUtilisateur === userId ? { ...user, status: newStatus } : user
      ));
      
      alert(`Utilisateur ${newStatus ? 'activé' : 'désactivé'} avec succès`);
    } catch (err) {
      setError('Erreur lors de la modification du statut');
      console.error('Error updating status:', err);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`,
        { headers: getAuthHeaders() }
      );
      setUsers(users.filter(user => user.idUtilisateur !== userId));
      alert('Utilisateur supprimé avec succès');
      fetchUsers(); // Recharger pour mettre à jour les stats
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Error deleting user:', err);
    }
  };

  // Gérer les changements de filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Appliquer les filtres
  const applyFilters = () => {
    fetchUsers();
  };

  // Effacer les filtres
  const clearFilters = () => {
    setFilters({ role: '', search: '' });
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  // Recharger quand les filtres changent (optionnel - décommenter si souhaité)
  // useEffect(() => {
  //   fetchUsers();
  // }, [filters]);

  if (loading) return <div className="loading">Chargement des utilisateurs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <h1 className="admin-page-title">Gestion des utilisateurs & rôles</h1>

      {/* Stats rapides */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.total}</div>
          <div className="admin-stat-label">Total utilisateurs</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.students}</div>
          <div className="admin-stat-label">Étudiants</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.teachers}</div>
          <div className="admin-stat-label">Enseignants</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.admins}</div>
          <div className="admin-stat-label">Admins</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-filters" style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="role-filter" style={{ marginRight: '0.5rem' }}>Rôle :</label>
            <select 
              id="role-filter"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Tous les rôles</option>
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search-filter" style={{ marginRight: '0.5rem' }}>Recherche :</label>
            <input
              id="search-filter"
              type="text"
              placeholder="Nom, prénom, email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
            />
          </div>

          <button 
            onClick={applyFilters}
            className="admin-btn btn-view"
            style={{ marginLeft: 'auto' }}
          >
            Appliquer
          </button>
          
          <button 
            onClick={clearFilters}
            className="admin-btn btn-reject"
          >
            Effacer
          </button>
        </div>
      </div>

      {/* Tableau complet avec TOUTES les actions US 5.3 */}
      <div className="admin-table-container">
        <h2>Liste des utilisateurs</h2>
        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Aucun utilisateur trouvé
          </div>
        ) : (
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
              {users.map(user => (
                <tr key={user.idUtilisateur}>
                  <td>{user.idUtilisateur}</td>
                  <td>{user.prenom} {user.nom}</td>
                  <td>{user.email}</td>
                  <td>
                    <select 
                      value={user.role}
                      onChange={(e) => updateUserRole(user.idUtilisateur, e.target.value)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        background: 'white'
                      }}
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="enseignant">Enseignant</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status ? 'status-active' : 'status-inactive'}`}>
                      {user.status ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="actions-cell">
                    <button 
                      className="admin-btn btn-view"
                      onClick={() => {/* Navigation vers le profil */}}
                    >
                      Voir
                    </button>
                    
                    {user.status ? (
                      <button 
                        className="admin-btn btn-reject"
                        onClick={() => toggleUserStatus(user.idUtilisateur, user.status)}
                      >
                        Suspendre
                      </button>
                    ) : (
                      <button 
                        className="admin-btn btn-validate"
                        onClick={() => toggleUserStatus(user.idUtilisateur, user.status)}
                      >
                        Réactiver
                      </button>
                    )}
                    
                    <button 
                      className="admin-btn btn-delete"
                      onClick={() => deleteUser(user.idUtilisateur)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Légende des actions */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #0c4a6e' }}>
        <strong>Actions disponibles :</strong><br />
        • <span style={{color:'#2563eb'}}>Voir profil</span> • 
        • <span style={{color:'#ca8a04'}}>Modifier rôle</span> (menu déroulant) • 
        • <span style={{color:'#dc2626'}}>Suspendre</span> (bloque l'accès) • 
        • <span style={{color:'#16a34a'}}>Réactiver</span> • 
        • <span style={{color:'#991b1b'}}>Supprimer définitivement</span>
      </div>
    </>
  );
};

export default UsersManagement;