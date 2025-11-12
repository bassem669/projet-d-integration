import React, { useState } from 'react';
import Navbar from "../Navbar";
import { Link, useLocation } from 'react-router-dom';
import './theme_etudiant.css';
// Import des données centralisées
import { allCourses, userData, badges } from '../../data/mockData';
import { useNavigate } from "react-router-dom";

const DashboardEtudiant = () => {
  const [user] = useState(userData); // Utilise les données importées
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprime éventuellement les infos de l'utilisateur
    localStorage.removeItem("user");
    // Redirection vers la page de connexion
    navigate("/login");
  };

  // Utilise les 3 premiers cours pour le dashboard
  const dashboardCourses = allCourses.slice(0, 3).map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    progress: course.progress,
    icon: course.image, // Utilise l'image comme icône
    status: course.category === 'en-cours' ? 'En cours' :
      course.category === 'nouveaux' ? 'Nouveau' : 'Terminé'
  }));

  // Calcul des statistiques réelles
  const stats = {
    progressionGlobale: Math.round(allCourses.reduce((acc, course) => acc + course.progress, 0) / allCourses.length),
    coursSuivis: allCourses.filter(c => c.progress > 0).length,
    quizReussis: Math.floor(allCourses.reduce((acc, course) => acc + course.progress, 0) / 10) // Simulation
  };

  return (
    <>
      <Navbar />  {/* ✅ Navbar affichée en haut */}
      <div className="dashboard-layout dashboard-etudiant">
        <div className="app-container">

          <div className="main-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <nav>
                <ul className="sidebar-menu">
                  <li className="sidebar-item">
                    <Link
                      to="/dashboard"
                      className={`sidebar-link ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}
                    >
                      <span className="sidebar-icon">📊</span>
                      Tableau de bord
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/cours"
                      className={`sidebar-link ${location.pathname === '/cours' ? 'active' : ''}`}
                    >
                      <span className="sidebar-icon">📚</span>
                      Mes cours
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/quiz"
                      className={`sidebar-link ${location.pathname === '/quiz' ? 'active' : ''}`}
                    >
                      <span className="sidebar-icon">✏️</span>
                      Quiz & Évaluations
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/progression"
                      className={`sidebar-link ${location.pathname === '/progression' ? 'active' : ''}`}
                    >
                      <span className="sidebar-icon">📈</span>
                      Progression
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/profil"
                      className={`sidebar-link ${location.pathname === '/profil' ? 'active' : ''}`}
                    >
                      <span className="sidebar-icon">👤</span>
                      Mon profil
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
              {/* Welcome Section */}
              <section className="welcome-section">
                <h1 className="welcome-title">Bonjour, {user.name} !</h1>
                <p className="welcome-subtitle">
                  Bienvenue sur votre tableau de bord EDULEARN. Continuez votre apprentissage là où vous l'avez laissé.
                </p>
                <div className="search-bar">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un cours, un sujet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="search-button">🔍 Rechercher</button>
                </div>
              </section>

              {/* Courses Section */}
              <section className="courses-section">
                <h2 className="section-title">Mes cours récents</h2>
                <div className="courses-grid">
                  {dashboardCourses.map(course => (
                    <div key={course.id} className="course-card">
                      <div className="course-header">
                        <div className="course-icon">{course.icon}</div>
                        <div className="course-badge">{course.status}</div>
                      </div>
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>

                      <div className="course-progress">
                        <div className="progress-text">
                          <span>Progression</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link
                        to={`/cours/${course.id}`}
                        className="start-button"
                      >
                        {course.progress > 0 ? 'Continuer' : 'Commencer'}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Lien vers tous les cours */}
                <div className="view-all-courses">
                  <Link to="/cours" className="view-all-link">
                    Voir tous mes cours ({allCourses.length}) →
                  </Link>
                </div>
              </section>
            </main>

            {/* Right Sidebar - Statistics */}
            <aside className="right-sidebar">
              <div className="stats-section">
                <h3 className="stats-title">Mes statistiques</h3>

                <div className="stats-card">
                  <div className="stats-value">{stats.progressionGlobale}%</div>
                  <div className="stats-label">Progression globale</div>
                </div>

                <div className="stats-card">
                  <div className="stats-value">{stats.coursSuivis}/{allCourses.length}</div>
                  <div className="stats-label">Cours suivis</div>
                </div>

                <div className="stats-card">
                  <div className="stats-value">{stats.quizReussis}</div>
                  <div className="stats-label">Quiz réussis</div>
                </div>
              </div>

              <div className="badges-section">
                <h3 className="badges-title">Mes badges</h3>
                <div className="badges-grid">
                  {badges.map(badge => (
                    <div key={badge.id} className="badge-item">
                      <div className="badge-icon">{badge.icon}</div>
                      <div className="badge-name">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardEtudiant;