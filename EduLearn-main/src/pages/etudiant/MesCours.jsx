import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const MesCours = () => {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursInscrits = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        // Vérifier si l'utilisateur est connecté et est un étudiant
        if (!user || !user.idUtilisateur) {
          throw new Error("Utilisateur non connecté");
        }

        // Fetch only enrolled courses from backend
        const res = await fetch(`http://localhost:5000/api/inscription/mes-cours`, {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des cours inscrits");
        }

        const data = await res.json();
        setCours(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCoursInscrits();
  }, []);

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
            <p className="mt-2">Chargement de vos cours...</p>
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Mes Cours Inscrits</h3>
            <span className="badge bg-primary">
              {cours.length} cours{cours.length !== 1 ? 's' : ''}
            </span>
          </div>

          {cours.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state">
                <div className="empty-icon mb-3">
                  <span style={{fontSize: '4rem'}}>📚</span>
                </div>
                <h5 className="text-muted">Aucun cours inscrit</h5>
                <p className="text-muted mb-4">
                  Vous n'êtes actuellement inscrit à aucun cours.
                </p>
                <Link to="/cours-disponibles" className="btn btn-primary">
                  Voir les cours disponibles
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {cours.map(c => (
                <div key={c.idCours} className="col-md-6 col-lg-4">
                  <div className="card-modern p-3 h-100 d-flex flex-column">
                    <div className="course-header mb-3">
                      <h5 className="text-primary">{c.titre}</h5>
                      <span className="badge bg-success small">Inscrit</span>
                    </div>
                    
                    <p className="text-muted small flex-grow-1">{c.description}</p>

                    <div className="course-info mt-auto">
                      <div className="info-item small mb-2">
                        <strong>👨‍🏫 Enseignant:</strong> {c.nomEnseignant || c.nomUtilisateur}
                      </div>
                      <div className="info-item small mb-2">
                        <strong>🏫 Classe:</strong> {c.nomClasse || 'Non spécifiée'}
                      </div>
                      <div className="info-item small mb-3">
                        <strong>📅 Date:</strong> {new Date(c.DateCours).toLocaleDateString('fr-FR')}
                      </div>

                      <div className="d-grid gap-2">
                        <Link 
                          to={`/cours/${c.idCours}`} 
                          className="btn btn-primary btn-sm"
                        >
                          📖 Accéder au cours
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MesCours;