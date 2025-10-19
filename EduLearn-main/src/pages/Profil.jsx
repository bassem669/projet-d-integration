import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import './theme_etudiant.css';

const Profil = () => {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "Nom",
    lastName: "Prénom",
    email: "nom.prenom@email.com",
    phone: "+33 1 23 45 67 89",
    level: "Intermédiaire",
    joinDate: "15 Janvier 2024",
    bio: "Étudiant passionné par l'apprentissage en ligne et le développement personnel.",
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  });

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type, value) => {
    setUserData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const userStats = {
    coursesCompleted: 8,
    totalStudyTime: "156h 30m",
    averageScore: 87,
    currentStreak: 12,
    badgesEarned: 15
  };

  return (
    <div className="dashboard-layout dashboard-etudiant">
    <div className="app-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="logo">
  <img src={logo} alt="EduLearn" className="logo-image" />
</div>
        <ul className="nav-menu">
          <li><Link to="/cours">Cours</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/progression">Progression</Link></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="user-profile">
          <Link to="/profil" className="profile-link">
            <div className="profile-pic">NP</div>
            <span>{userData.firstName} {userData.lastName}</span>
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
          {/* Header Section */}
          <section className="profile-header">
            <div className="header-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  NP
                </div>
                <div className="profile-info">
                  <h1 className="page-title">
                    {isEditing ? (
                      <div className="edit-name-fields">
                        <input
                          type="text"
                          value={userData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="name-input"
                        />
                        <input
                          type="text"
                          value={userData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="name-input"
                        />
                      </div>
                    ) : (
                      `${userData.firstName} ${userData.lastName}`
                    )}
                  </h1>
                  <p className="profile-level">{userData.level}</p>
                  <p className="profile-join-date">Membre depuis {userData.joinDate}</p>
                </div>
              </div>
              <button 
                className={`edit-profile-btn ${isEditing ? 'save' : 'edit'}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '💾 Sauvegarder' : '✏️ Modifier le profil'}
              </button>
            </div>
          </section>

          {/* Profile Stats */}
          <section className="profile-stats">
            <div className="stats-grid-profile">
              <div className="stat-card-profile">
                <div className="stat-icon-profile">📚</div>
                <div className="stat-content-profile">
                  <div className="stat-value-profile">{userStats.coursesCompleted}</div>
                  <div className="stat-label-profile">Cours terminés</div>
                </div>
              </div>
              
              <div className="stat-card-profile">
                <div className="stat-icon-profile">⏱️</div>
                <div className="stat-content-profile">
                  <div className="stat-value-profile">{userStats.totalStudyTime}</div>
                  <div className="stat-label-profile">Temps d'étude</div>
                </div>
              </div>
              
              <div className="stat-card-profile">
                <div className="stat-icon-profile">📈</div>
                <div className="stat-content-profile">
                  <div className="stat-value-profile">{userStats.averageScore}%</div>
                  <div className="stat-label-profile">Score moyen</div>
                </div>
              </div>
              
              <div className="stat-card-profile">
                <div className="stat-icon-profile">🏆</div>
                <div className="stat-content-profile">
                  <div className="stat-value-profile">{userStats.badgesEarned}</div>
                  <div className="stat-label-profile">Badges obtenus</div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Information */}
          <section className="profile-info-section">
            <div className="profile-info-grid">
              {/* Personal Information */}
              <div className="info-card">
                <h3 className="info-card-title">Informations personnelles</h3>
                <div className="info-fields">
                  <div className="info-field">
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="info-input"
                      />
                    ) : (
                      <span className="info-value">{userData.email}</span>
                    )}
                  </div>
                  
                  <div className="info-field">
                    <label>Téléphone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="info-input"
                      />
                    ) : (
                      <span className="info-value">{userData.phone}</span>
                    )}
                  </div>
                  
                  <div className="info-field">
                    <label>Niveau</label>
                    {isEditing ? (
                      <select 
                        value={userData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="info-select"
                      >
                        <option>Débutant</option>
                        <option>Intermédiaire</option>
                        <option>Avancé</option>
                        <option>Expert</option>
                      </select>
                    ) : (
                      <span className="info-value">{userData.level}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="info-card">
                <h3 className="info-card-title">À propos de moi</h3>
                {isEditing ? (
                  <textarea
                    value={userData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="bio-textarea"
                    rows="4"
                    placeholder="Décrivez-vous en quelques mots..."
                  />
                ) : (
                  <p className="bio-content">{userData.bio}</p>
                )}
              </div>

              {/* Notifications Settings */}
              <div className="info-card">
                <h3 className="info-card-title">Paramètres de notification</h3>
                <div className="notification-settings">
                  <div className="notification-item">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        checked={userData.notifications.email}
                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                        className="notification-checkbox"
                      />
                      <span className="checkmark"></span>
                      Notifications par email
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        checked={userData.notifications.push}
                        onChange={(e) => handleNotificationChange('push', e.target.checked)}
                        className="notification-checkbox"
                      />
                      <span className="checkmark"></span>
                      Notifications push
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <label className="notification-label">
                      <input
                        type="checkbox"
                        checked={userData.notifications.sms}
                        onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                        className="notification-checkbox"
                      />
                      <span className="checkmark"></span>
                      Notifications SMS
                    </label>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="info-card">
                <h3 className="info-card-title">Actions du compte</h3>
                <div className="account-actions">
                  <button className="account-btn change-password">
                    🔒 Changer le mot de passe
                  </button>
                  <button className="account-btn download-data">
                    📥 Télécharger mes données
                  </button>
                  <button className="account-btn delete-account">
                    🗑️ Supprimer le compte
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Right Sidebar - Quick Actions */}
        <aside className="right-sidebar">
          <div className="profile-sidebar">
            <h3 className="stats-title">Actions rapides</h3>
            
            <div className="quick-action-card">
              <h4>🎯 Objectifs du mois</h4>
              <div className="quick-stats">
                <div className="quick-stat">
                  <span>Progression:</span>
                  <span className="quick-value">75%</span>
                </div>
                <div className="quick-stat">
                  <span>Cours en cours:</span>
                  <span className="quick-value">4</span>
                </div>
                <div className="quick-stat">
                  <span>Quiz ce mois:</span>
                  <span className="quick-value">8/10</span>
                </div>
              </div>
            </div>

            <div className="quick-action-card">
              <h4>📚 Recommandations</h4>
              <div className="recommendations">
                <div className="recommendation-item">
                  <span className="rec-icon">💻</span>
                  <span>Python Avancé</span>
                </div>
                <div className="recommendation-item">
                  <span className="rec-icon">📊</span>
                  <span>Data Analysis</span>
                </div>
                <div className="recommendation-item">
                  <span className="rec-icon">🌐</span>
                  <span>Web Development</span>
                </div>
              </div>
            </div>

            <div className="quick-action-card">
              <h4>⚙️ Paramètres</h4>
              <div className="settings-links">
                <a href="#privacy" className="settings-link">🔒 Confidentialité</a>
                <a href="#security" className="settings-link">🛡️ Sécurité</a>
                <a href="#preferences" className="settings-link">🎛️ Préférences</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
};

export default Profil;