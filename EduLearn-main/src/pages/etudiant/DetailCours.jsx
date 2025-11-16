import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const DetailCours = () => {
  const { id } = useParams();
  const [cours, setCours] = useState(null);
  const [ressources, setRessources] = useState([]);
  const [forumMessages, setForumMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation données - À REMPLACER par appels API réels
    setTimeout(() => {
      setCours({
        idCours: parseInt(id),
        titre: `Cours ${id}`,
        description: "Description du cours...",
        nomUtilisateur: "Enseignant",
        nomClasse: "Classe",
        DateCours: "2025-01-01"
      });

      setRessources([
        { id: 1, nom: "Support PDF", type: "pdf" },
        { id: 2, nom: "Exercices", type: "doc" }
      ]);

      setForumMessages([
        { id: 1, contenu: "Premier message", nomUtilisateur: "Étudiant", date: "2025-01-01" }
      ]);

      setLoading(false);
    }, 500);
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: forumMessages.length + 1,
      contenu: newMessage,
      nomUtilisateur: "Vous", 
      date: new Date().toLocaleDateString()
    };

    setForumMessages([message, ...forumMessages]);
    setNewMessage('');
  };

  const handleDownload = (ressource) => {
    alert(`Télécharger: ${ressource.nom}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
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
            <Link to="/cours" className="btn btn-outline-primary btn-sm">
              ← Retour
            </Link>
          </div>

          {/* En-tête cours */}
          <div className="card-modern p-4 mb-4">
            <h1>{cours.titre}</h1>
            <p className="text-muted">{cours.description}</p>
            <div className="text-muted small">
              Enseignant: {cours.nomUtilisateur} | Classe: {cours.nomClasse}
            </div>
          </div>

          <div className="row">
            {/* Section Ressources */}
            <div className="col-lg-6">
              <div className="card-modern p-4 mb-4">
                <h5>📚 Ressources</h5>
                
                {ressources.length > 0 ? (
                  <div className="mt-3">
                    {ressources.map(ressource => (
                      <div key={ressource.id} className="border rounded p-3 mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{ressource.nom}</strong>
                            <div className="text-muted small">{ressource.type}</div>
                          </div>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleDownload(ressource)}
                          >
                            Télécharger
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Aucune ressource</p>
                )}
              </div>
            </div>

            {/* Section Forum */}
            <div className="col-lg-6">
              <div className="card-modern p-4">
                <h5>💬 Forum</h5>

                {/* Formulaire message */}
                <form onSubmit={handleSendMessage} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      Envoyer
                    </button>
                  </div>
                </form>

                {/* Messages */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {forumMessages.map(message => (
                    <div key={message.id} className="border rounded p-3 mb-2">
                      <div className="d-flex justify-content-between">
                        <strong>{message.nomUtilisateur}</strong>
                        <small className="text-muted">{message.date}</small>
                      </div>
                      <p className="mb-0 mt-2">{message.contenu}</p>
                    </div>
                  ))}
                </div>

                {forumMessages.length === 0 && (
                  <p className="text-muted text-center mt-3">Aucun message</p>
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