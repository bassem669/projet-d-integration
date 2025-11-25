// src/pages/admin/CourseModeration.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from './../../services/apiConfig';

export default function CourseModeration() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer les cours
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/courses',
        {
          headers: getAuthHeaders()
        }
      );
      setCourses(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des cours');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (coursesData) => {
    const pending = coursesData.filter(course => course.status === 'PENDING').length;
    const approved = coursesData.filter(course => course.status === 'APPROVED').length;
    const rejected = coursesData.filter(course => course.status === 'REJECTED').length;
    
    setStats({ pending, approved, rejected });
  };

  // Mettre à jour le statut d'un cours
  const updateCourseStatus = async (courseId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/courses/${courseId}/status`, {
        status: status
      },{
        headers: getAuthHeaders()
      });
      
      // Recharger les données
      fetchCourses();
    } catch (err) {
      setError(`Erreur lors de la ${status === 'APPROVED' ? 'validation' : 'rejet'} du cours`);
      console.error('Erreur:', err);
    }
  };

  // Filtrer les cours
  useEffect(() => {
    let filtered = courses;

    // Filtre par statut
    if (activeFilter !== 'ALL') {
      filtered = filtered.filter(course => course.status === activeFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.titre.toLowerCase().includes(term) ||
        (course.nom_enseignant && course.nom_enseignant.toLowerCase().includes(term)) ||
        (course.description && course.description.toLowerCase().includes(term))
      );
    }

    setFilteredCourses(filtered);
  }, [courses, activeFilter, searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Obtenir le texte du statut
  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'En attente',
      'APPROVED': 'Validé',
      'REJECTED': 'Refusé'
    };
    return statusMap[status] || status;
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status) => {
    const classMap = {
      'PENDING': 'status-pending',
      'APPROVED': 'status-approved',
      'REJECTED': 'status-rejected'
    };
    return classMap[status] || '';
  };

  if (loading) {
    return <div className="loading">Chargement des cours...</div>;
  }

  return (
    <>
      <h1 className="admin-page-title">Modération des cours</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      <div className="admin-stats-grid">
        <div 
          className={`admin-stat-card ${activeFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ALL')}
          style={{cursor: 'pointer'}}
        >
          <div className="admin-stat-value">{courses.length}</div>
          <div className="admin-stat-label">Tous les cours</div>
        </div>
        <div 
          className={`admin-stat-card ${activeFilter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveFilter('PENDING')}
          style={{cursor: 'pointer'}}
        >
          <div className="admin-stat-value">{stats.pending}</div>
          <div className="admin-stat-label">En attente</div>
        </div>
        <div 
          className={`admin-stat-card ${activeFilter === 'APPROVED' ? 'active' : ''}`}
          onClick={() => setActiveFilter('APPROVED')}
          style={{cursor: 'pointer'}}
        >
          <div className="admin-stat-value">{stats.approved}</div>
          <div className="admin-stat-label">Validés</div>
        </div>
        <div 
          className={`admin-stat-card ${activeFilter === 'REJECTED' ? 'active' : ''}`}
          onClick={() => setActiveFilter('REJECTED')}
          style={{cursor: 'pointer'}}
        >
          <div className="admin-stat-value">{stats.rejected}</div>
          <div className="admin-stat-label">Refusés</div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="admin-filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un cours, un enseignant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            Tous
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setActiveFilter('PENDING')}
          >
            En attente
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'APPROVED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('APPROVED')}
          >
            Validés
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'REJECTED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('REJECTED')}
          >
            Refusés
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <h2>
          {activeFilter === 'ALL' && 'Tous les cours'}
          {activeFilter === 'PENDING' && 'Cours en attente de validation'}
          {activeFilter === 'APPROVED' && 'Cours validés'}
          {activeFilter === 'REJECTED' && 'Cours refusés'}
          <span className="course-count"> ({filteredCourses.length})</span>
        </h2>
        
        {filteredCourses.length === 0 ? (
          <p className="no-data">
            {searchTerm ? 'Aucun cours ne correspond à votre recherche' : 'Aucun cours trouvé'}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Enseignant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.idCours}>
                  <td>
                    <div className="course-title">{course.titre}</div>
                    {course.description && (
                      <div className="course-description">{course.description}</div>
                    )}
                  </td>
                  <td>{course.nom_enseignant || 'Non spécifié'}</td>
                  <td>
                    {course.DateCours 
                      ? new Date(course.DateCours).toLocaleDateString('fr-FR')
                      : 'Non spécifiée'
                    }
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                  </td>
                  <td>
                    {course.status === 'PENDING' && (
                      <>
                        <button 
                          className="admin-btn btn-validate"
                          onClick={() => updateCourseStatus(course.idCours, 'APPROVED')}
                        >
                          Valider
                        </button>
                        <button 
                          className="admin-btn btn-reject"
                          onClick={() => updateCourseStatus(course.idCours, 'REJECTED')}
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    {course.status !== 'PENDING' && (
                      <button 
                        className="admin-btn btn-secondary"
                        onClick={() => updateCourseStatus(course.idCours, 'PENDING')}
                      >
                        Remettre en attente
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}