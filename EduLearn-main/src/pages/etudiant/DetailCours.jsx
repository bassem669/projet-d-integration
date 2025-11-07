import React from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import './theme_details_cours.css';
import { allCourses } from '../../data/mockData';

const DetailCours = () => {
  const { id } = useParams();
  const cours = allCourses.find(course => course.id === parseInt(id));

  // Fonction pour télécharger une ressource
  const handleDownload = (resource, courseTitle) => {
    // Simulation de création de fichier
    const downloadFile = (content, filename, mimeType) => {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    // Contenu simulé selon le type de fichier
    let content, filename, mimeType;

    switch (resource.type) {
      case 'pdf':
        content = `PDF Simulation - ${resource.nom}\n\nCours: ${courseTitle}\n\nCeci est une simulation de fichier PDF pour ${resource.nom}.`;
        filename = `${resource.nom.replace(/\s+/g, '_')}.pdf`;
        mimeType = 'application/pdf';
        break;
      
      case 'doc':
        content = `Document Simulation - ${resource.nom}\n\nCours: ${courseTitle}\n\nCeci est une simulation de document Word pour ${resource.nom}.`;
        filename = `${resource.nom.replace(/\s+/g, '_')}.doc`;
        mimeType = 'application/msword';
        break;
      
      case 'video':
        content = `Video Simulation - ${resource.nom}\n\nCours: ${courseTitle}\n\nCeci est une simulation de fichier vidéo pour ${resource.nom}.`;
        filename = `${resource.nom.replace(/\s+/g, '_')}.mp4`;
        mimeType = 'video/mp4';
        break;
      
      case 'zip':
        content = `Archive Simulation - ${resource.nom}\n\nCours: ${courseTitle}\n\nCeci est une simulation d'archive ZIP pour ${resource.nom}.`;
        filename = `${resource.nom.replace(/\s+/g, '_')}.zip`;
        mimeType = 'application/zip';
        break;
      
      default:
        content = `Fichier Simulation - ${resource.nom}\n\nCours: ${courseTitle}`;
        filename = `${resource.nom.replace(/\s+/g, '_')}.txt`;
        mimeType = 'text/plain';
    }

    // Ajouter un délai pour simuler le téléchargement
    const downloadButton = document.querySelector(`[data-resource-id="${resource.id}"]`);
    if (downloadButton) {
      downloadButton.textContent = '⏳ Téléchargement...';
      downloadButton.disabled = true;
    }

    setTimeout(() => {
      downloadFile(content, filename, mimeType);
      
      // Remettre le bouton à son état initial
      if (downloadButton) {
        downloadButton.textContent = '📥 Télécharger';
        downloadButton.disabled = false;
      }

      // Notification de succès
      alert(`✅ "${resource.nom}" a été téléchargé avec succès!`);
    }, 1500);
  };

  // Fonction pour télécharger tout le cours
  const handleDownloadAll = () => {
    if (!cours.ressources || cours.ressources.length === 0) {
      alert('Aucune ressource disponible pour ce cours.');
      return;
    }

    const downloadButton = document.querySelector('.download-all-btn');
    if (downloadButton) {
      downloadButton.textContent = '⏳ Préparation...';
      downloadButton.disabled = true;
    }

    setTimeout(() => {
      // Créer un ZIP simulé avec toutes les ressources
      const zipContent = `Archive du cours: ${cours.title}\n\n`;
      const resourcesList = cours.ressources.map(resource => 
        `- ${resource.nom} (${resource.type}, ${resource.taille})`
      ).join('\n');
      
      const fullContent = zipContent + resourcesList + 
        `\n\nTotal: ${cours.ressources.length} ressources` +
        `\nDate: ${new Date().toLocaleDateString()}`;

      const blob = new Blob([fullContent], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cours.title.replace(/\s+/g, '_')}_Archive.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Remettre le bouton à son état initial
      if (downloadButton) {
        downloadButton.textContent = '📦 Télécharger tout le cours';
        downloadButton.disabled = false;
      }

      alert(`✅ Archive du cours "${cours.title}" téléchargée! Contient ${cours.ressources.length} ressources.`);
    }, 2000);
  };

  if (!cours) {
    return (
      <div className="detail-cours-layout">
        <div className="detail-main-content">
          <div className="no-course-message">
            <h2>📚 Cours non trouvé</h2>
            <p>Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link to="/cours" className="back-to-catalog">
              ← Retour au catalogue des cours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'video': return '🎥';
      case 'zip': return '📦';
      default: return '📎';
    }
  };

  return (
    <div className="detail-cours-layout">
      {/* Navigation simplifiée */}
      <header className="detail-header">
        <div className="detail-nav">
          <Link to="/">
            <img src={logo} alt="EduLearn" className="logo-image" />
          </Link>
          
        </div>
        <div className="detail-user-profile">
          <div className="profile-pic">NP</div>
          <span>Nom Prénom</span>
        </div>
      </header>

      <main className="detail-main-content">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link to="/cours">
            ← Retour au catalogue des cours
          </Link>
        </nav>

        {/* En-tête du cours */}
        <section className="course-detail-header">
          <h1>{cours.title}</h1>
          <div className="course-detail-meta">
            <span className="meta-item">⏱️ {cours.duration}</span>
            <span className="meta-item">📊 {cours.level}</span>
            <span className="meta-item">👤 {cours.instructor}</span>
            <span className="meta-item">⭐ {cours.rating}/5</span>
          </div>
          <p className="course-detail-description">
            {cours.description}
          </p>
        </section>

        {/* Progression (si le cours est commencé) */}
        {cours.progress > 0 && (
          <section className="course-progress-detail">
            <div className="progress-stats">
              <div>
                <div className="progress-percentage">{cours.progress}%</div>
                <div className="progress-label">Progression globale</div>
              </div>
              <div className="last-accessed">
                Dernier accès: {cours.lastAccessed}
              </div>
            </div>
            <div className="progress-bar-detail">
              <div 
                className="progress-fill-detail" 
                style={{ width: `${cours.progress}%` }}
              ></div>
            </div>
          </section>
        )}

        {/* Bouton Télécharger tout */}
        {cours.ressources && cours.ressources.length > 0 && (
          <section className="detail-content-section">
            <div className="download-all-section">
              <button 
                className="download-all-btn"
                onClick={handleDownloadAll}
              >
                📦 Télécharger tout le cours ({cours.ressources.length} ressources)
              </button>
            </div>
          </section>
        )}

        {/* Contenu du cours */}
        <section className="detail-content-section">
          <h2>📖 Contenu du cours</h2>
          <div className="course-text-content">
            {cours.contenu ? (
              cours.contenu.split('\n').map((line, index) => (
                <div key={index}>
                  {line.startsWith('# ') ? (
                    <h1>{line.replace('# ', '')}</h1>
                  ) : line.startsWith('## ') ? (
                    <h2>{line.replace('## ', '')}</h2>
                  ) : line.startsWith('### ') ? (
                    <h3>{line.replace('### ', '')}</h3>
                  ) : line.startsWith('- ') ? (
                    <li>{line.replace('- ', '')}</li>
                  ) : (
                    <p>{line}</p>
                  )}
                </div>
              ))
            ) : (
              <p>Le contenu détaillé de ce cours sera disponible prochainement.</p>
            )}
          </div>
        </section>

        {/* Ressources téléchargeables */}
        <section className="detail-content-section">
          <h2>📚 Ressources d'apprentissage</h2>
          <div className="resources-list">
            {cours.ressources && cours.ressources.length > 0 ? (
              cours.ressources.map(ressource => (
                <div key={ressource.id} className="resource-item">
                  <div className="resource-icon">
                    {getResourceIcon(ressource.type)}
                  </div>
                  <div className="resource-info">
                    <div className="resource-name">{ressource.nom}</div>
                    <div className="resource-meta">
                      <span className="resource-type">{ressource.type.toUpperCase()}</span>
                      <span className="resource-size">{ressource.taille}</span>
                    </div>
                  </div>
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(ressource, cours.title)}
                    data-resource-id={ressource.id}
                  >
                    📥 Télécharger
                  </button>
                </div>
              ))
            ) : (
              <p>Aucune ressource disponible pour le moment.</p>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="course-detail-actions">
          <button className="btn-primary-detail">
            {cours.progress > 0 ? '➤ Continuer le cours' : '🎯 Commencer le cours'}
          </button>
          <button className="btn-secondary-detail">
            {cours.isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
          </button>
        </section>
      </main>
    </div>
  );
};

export default DetailCours;