import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo_edu.png';
import './theme_etudiant.css';

const DashboardEtudiant = () => {
  const [user] = useState({
    name: "Nom du étudiant",
    profileInitials: "NE"
  });

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 1,
      title: "Introduction à la Programmation",
      description: "Apprenez les bases de la programmation avec Python et développez vos premières applications.",
      progress: 65,
      icon: "💻",
      status: "En cours"
    },
    {
      id: 2,
      title: "Mathématiques Avancées",
      description: "Algèbre linéaire, calcul différentiel et applications pratiques en sciences.",
      progress: 40,
      icon: "🧮",
      status: "En cours"
    },
    {
      id: 3,
      title: "Histoire de l'Art Moderne",
      description: "Découvrez les mouvements artistiques du 20ème siècle et leurs influences.",
      progress: 20,
      icon: "🎨",
      status: "Nouveau"
    }
  ];

  const badges = [
    { id: 1, name: "Débutant", icon: "⭐" },
    { id: 2, name: "Assidu", icon: "🔥" },
    { id: 3, name: "Curieux", icon: "🔍" },
    { id: 4, name: "Persévérant", icon: "💪" },
    { id: 5, name: "Rapide", icon: "⚡" },
    { id: 6, name: "Expert", icon: "🏆" }
  ];

  return (
    <div className="dashboard-layout dashboard-etudiant">
    <div className="app-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="EduLearn" className="logo-image" />
          </Link>
        </div>

        <ul className="nav-menu">
          <li><Link to="/cours" className={location.pathname === '/cours' ? 'nav-active' : ''}>Cours</Link></li>
          <li><Link to="/quiz" className={location.pathname === '/quiz' ? 'nav-active' : ''}>Quiz</Link></li>
          <li><Link to="/progression" className={location.pathname === '/progression' ? 'nav-active' : ''}>Progression</Link></li>
          <li>
          {/* CHANGEMENT ICI : remplacer <a> par <Link> */}
          <Link to="/contact" className={location.pathname === '/contact' ? 'nav-active' : ''}>
            Contact
          </Link>
        </li>
        </ul>
        <div className="user-profile">
          <Link to="/profil" className="profile-link">
            <div className="profile-pic">{user.profileInitials}</div>
            <span>{user.name}</span>
          </Link>
        </div>
      </nav>

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
              <li className="sidebar-item">
                <a href="#deconnexion" className="sidebar-link">
                  <span className="sidebar-icon">🚪</span>
                  Déconnexion
                </a>
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
            <h2 className="section-title">Mes cours</h2>
            <div className="courses-grid">
              {courses.map(course => (
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
                  
                  <button className="start-button">
                    {course.progress > 0 ? 'Continuer' : 'Commencer'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar - Statistics */}
        <aside className="right-sidebar">
          <div className="stats-section">
            <h3 className="stats-title">Mes statistiques</h3>
            
            <div className="stats-card">
              <div className="stats-value">75%</div>
              <div className="stats-label">Progression globale</div>
            </div>
            
            <div className="stats-card">
              <div className="stats-value">12/15</div>
              <div className="stats-label">Cours suivis</div>
            </div>
            
            <div className="stats-card">
              <div className="stats-value">8</div>
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
  );
};

export default DashboardEtudiant;