import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const DetailCours = () => {
  const { id } = useParams(); // courseId
  const [cours, setCours] = useState(null);
  const [ressources, setRessources] = useState([]);
  const [forumMessages, setForumMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1️⃣ Get course details
        const coursRes = await fetch(`http://localhost:5000/api/cours/${id}`, {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });
        const coursData = await coursRes.json();
        setCours(coursData);

        // 2️⃣ Get resources for this course
        const resRes = await fetch(`http://localhost:5000/api/resources/${id}`, {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });
        const resData = await resRes.json();
        setRessources(resData);

        // 3️⃣ Optionally, fetch forum messages (mocked for now)
        setForumMessages([
          { id: 1, contenu: "Premier message", nomUtilisateur: "Étudiant", date: "2025-01-01" }
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du cours:", err);
        setLoading(false);
      }
    };

    fetchData();
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
    // Open URL in a new tab
    window.open(ressource.url, "_blank");
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

          {/* Cours details */}
          <div className="card-modern p-4 mb-4">
            <h1>{cours.titre}</h1>
            <p className="text-muted">{cours.description}</p>
            <div className="text-muted small">
              Enseignant: {cours.nomUtilisateur} | Classe: {cours.nomClasse}
            </div>
          </div>

          <div className="row">
            {/* Resources */}
            <div className="col-lg-6">
              <div className="card-modern p-4 mb-4">
                <h5>📚 Ressources</h5>
                {ressources.length > 0 ? (
                  <div className="mt-3">
                    {ressources.map(r => (
                      <div key={r.id} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{r.type}</strong> {/* or r.nom if you have it */}
                          <div className="text-muted small">{r.titreCours || ''}</div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => handleDownload(r)}>
                          Télécharger
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Aucune ressource</p>
                )}
              </div>
            </div>

            {/* Forum */}
            <div className="col-lg-6">
              <div className="card-modern p-4">
                <h5>💬 Forum</h5>
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

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {forumMessages.map(msg => (
                    <div key={msg.id} className="border rounded p-3 mb-2">
                      <div className="d-flex justify-content-between">
                        <strong>{msg.nomUtilisateur}</strong>
                        <small className="text-muted">{msg.date}</small>
                      </div>
                      <p className="mb-0 mt-2">{msg.contenu}</p>
                    </div>
                  ))}
                  {forumMessages.length === 0 && <p className="text-muted text-center mt-3">Aucun message</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailCours;
