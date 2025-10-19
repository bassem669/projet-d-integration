import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import './theme_etudiant.css';

const Quiz = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout dashboard-etudiant">
    <div className="app-container">
      <nav className="top-nav">
        <div className="logo">
  <img src={logo} alt="EduLearn" className="logo-image" />
</div>
        <ul className="nav-menu">
          <li><Link to="/cours" className={location.pathname === '/cours' ? 'nav-active' : ''}>Cours</Link></li>
          <li><Link to="/quiz" className={location.pathname === '/quiz' ? 'nav-active' : ''}>Quiz</Link></li>
          <li><Link to="/progression" className={location.pathname === '/progression' ? 'nav-active' : ''}>Progression</Link></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="user-profile">
          <Link to="/profil" className="profile-link">
            <div className="profile-pic">JD</div>
            <span>Nom Prenom</span>
          </Link>
        </div>
      </nav>

      <div className="main-layout">
        <aside className="sidebar">
          <nav>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
                <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}>
                  <span className="sidebar-icon">📊</span>
                  Tableau de bord
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/cours" className={`sidebar-link ${location.pathname === '/cours' ? 'active' : ''}`}>
                  <span className="sidebar-icon">📚</span>
                  Mes cours
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/quiz" className={`sidebar-link ${location.pathname === '/quiz' ? 'active' : ''}`}>
                  <span className="sidebar-icon">✏️</span>
                  Quiz & Évaluations
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/progression" className={`sidebar-link ${location.pathname === '/progression' ? 'active' : ''}`}>
                  <span className="sidebar-icon">📈</span>
                  Progression
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/profil" className={`sidebar-link ${location.pathname === '/profil' ? 'active' : ''}`}>
                  <span className="sidebar-icon">👤</span>
                  Mon profil
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1>Quiz & Évaluations</h1>
            <p>Testez vos connaissances et évaluez votre progression</p>
          </div>
          
          <div className="content-placeholder">
            <h2>Page Quiz en construction</h2>
            <p>Cette page sera disponible prochainement.</p>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
};

export default Quiz;