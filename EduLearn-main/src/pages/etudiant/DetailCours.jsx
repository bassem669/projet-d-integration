import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import {
  FaFilePdf,
  FaVideo,
  FaImage,
  FaFile,
  FaDownload,
  FaArrowLeft
} from 'react-icons/fa';
import './theme_etudiant.css';

const DetailCours = () => {
  const { id } = useParams(); // courseId
  const [cours, setCours] = useState(null);
  const [ressources, setRessources] = useState([]);
  const [forumMessages, setForumMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        // 1️⃣ Get course details
        const coursRes = await fetch(`http://localhost:5000/api/cours/${id}`, {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });
        
        if (!coursRes.ok) {
          throw new Error('Erreur lors du chargement du cours');
        }
        
        const coursData = await coursRes.json();
        setCours(coursData);

        // 2️⃣ Get resources for this course - CORRECTION ICI
        const resRes = await fetch(`http://localhost:5000/api/resources/${id}`, {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });
        
        if (!resRes.ok) {
          throw new Error('Erreur lors du chargement des ressources');
        }
        
        const resData = await resRes.json();
        
        // Vérifier la structure de la réponse
        if (resData.success && resData.data) {
          setRessources(resData.data);
        } else {
          setRessources(resData); // Fallback si la structure est différente
        }

        // 3️⃣ Optionally, fetch forum messages (mocked for now)
        setForumMessages([
          { 
            id: 1, 
            contenu: "Quelqu'un peut m'expliquer le chapitre 3 ?", 
            nomUtilisateur: "Étudiant1", 
            date: "2025-01-15" 
          },
          { 
            id: 2, 
            contenu: "Je cherche des exercices supplémentaires sur ce sujet.", 
            nomUtilisateur: "Étudiant2", 
            date: "2025-01-14" 
          }
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du cours:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FaFilePdf className="text-danger me-2" />;
      case 'video': return <FaVideo className="text-primary me-2" />;
      case 'image': return <FaImage className="text-success me-2" />;
      default: return <FaFile className="text-warning me-2" />;
    }
  };

  const getResourceTypeLabel = (type) => {
    const types = {
      'pdf': 'Document PDF',
      'video': 'Vidéo',
      'image': 'Image',
      'document': 'Document',
      'url': 'Lien externe'
    };
    return types[type?.toLowerCase()] || 'Fichier';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: forumMessages.length + 1,
      contenu: newMessage,
      nomUtilisateur: "Vous",
      date: new Date().toLocaleDateString('fr-FR')
    };

    setForumMessages([message, ...forumMessages]);
    setNewMessage('');
  };

  const handleDownload = (ressource) => {
    // Vérifier si c'est un fichier uploadé ou une URL externe
    if (ressource.filePath) {
      // Pour les fichiers uploadés, construire l'URL complète
      const downloadUrl = `http://localhost:5000${ressource.filePath}`;
      window.open(downloadUrl, "_blank");
    } else if (ressource.url) {
      // Pour les URLs externes
      window.open(ressource.url, "_blank");
    } else {
      console.error('Aucun lien disponible pour cette ressource');
      alert('Aucun lien disponible pour cette ressource');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement du cours...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content">
            <div className="alert alert-danger">
              <h5>Erreur</h5>
              <p>{error}</p>
              <Link to="/cours" className="btn btn-primary">
                <FaArrowLeft className="me-2" />
                Retour aux cours
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!cours) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content text-center py-5">
            <div className="alert alert-warning">
              <h5>Cours non trouvé</h5>
              <p>Le cours demandé n'existe pas ou vous n'y avez pas accès.</p>
              <Link to="/cours" className="btn btn-primary">
                <FaArrowLeft className="me-2" />
                Retour aux cours
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <MenuEtudiant />
        <div className="content">
          {/* Navigation */}
          <div className="mb-4">
            <Link to="/cours" className="btn btn-outline-primary">
              <FaArrowLeft className="me-2" />
              Retour aux cours
            </Link>
          </div>

          {/* Cours details */}
          <div className="card-modern p-4 mb-4">
            <div className="row">
              <div className="col-md-8">
                <h1 className="text-primary">{cours.titre}</h1>
                <p className="lead">{cours.description}</p>
                {cours.content && (
                  <div className="mt-3">
                    <h6>Contenu détaillé :</h6>
                    <p className="text-muted">{cours.content}</p>
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <div className="bg-light p-3 rounded">
                  <div className="mb-2">
                    <strong>👨‍🏫 Enseignant :</strong> {cours.nomUtilisateur}
                  </div>
                  <div className="mb-2">
                    <strong>🏫 Classe :</strong> {cours.nomClasse || 'Non spécifiée'}
                  </div>
                  <div>
                    <strong>📅 Date :</strong> {cours.DateCours ? new Date(cours.DateCours).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Resources */}
            <div className="col-lg-7">
              <div className="card-modern p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <FaDownload className="me-2 text-primary" />
                    Ressources du cours
                  </h5>
                  <span className="badge bg-primary">
                    {ressources.length} ressource(s)
                  </span>
                </div>
                
                {ressources.length > 0 ? (
                  <div className="mt-3">
                    {ressources.map(ressource => (
                      <div key={ressource.id} className="border rounded p-3 mb-3 resource-card">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              {getResourceIcon(ressource.type)}
                              <div>
                                <strong className="d-block">
                                  {getResourceTypeLabel(ressource.type)}
                                </strong>
                              </div>
                            </div>
                            
                            {/* Afficher le nom du fichier ou l'URL */}
                            {ressource.filePath && (
                              <div className="text-muted small">
                                Fichier : {ressource.filePath.split('/').pop()}
                              </div>
                            )}
                            {ressource.url && !ressource.filePath && (
                              <div className="text-muted small">
                                Lien : {ressource.url}
                              </div>
                            )}
                            
                            {/* Cours associé */}
                            {ressource.titreCours && (
                              <div className="text-muted small mt-1">
                                Cours : {ressource.titreCours}
                              </div>
                            )}
                          </div>
                          
                          <button 
                            className="btn btn-primary btn-sm ms-3"
                            onClick={() => handleDownload(ressource)}
                            title="Télécharger"
                          >
                            <FaDownload className="me-1" />
                            Ouvrir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaDownload size={48} className="text-muted mb-3" />
                    <p className="text-muted">Aucune ressource disponible pour ce cours</p>
                    <small className="text-muted">
                      L'enseignant n'a pas encore ajouté de ressources.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailCours;