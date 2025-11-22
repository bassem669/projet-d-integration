import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import de Link
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const DashboardEtudiant = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }

    // Simulation appel API - À REMPLACER par vos endpoints réels
    const fetchDashboardData = async () => {
      try {
        // Ici vous ferez l'appel API réel
        setTimeout(() => {
          setDashboardData({
            stats: {
              totalCours: 0,
              examensDisponibles: 0,
              quizDisponible: 0
            },
            coursRecents: [
              { 
                idCours: 3, 
                titre: "Mathématiques Avancées", 
                description: "Cours complet sur les concepts avancés",
                DateCours: "2025-11-11",
                nomClasse: "DS31"
              },
              { 
                idCours: 4, 
                titre: "Programmation Web", 
                description: "Apprenez à créer des sites web modernes",
                DateCours: "2026-02-01",
                nomClasse: "DS31"
              },
              { 
                idCours: 5, 
                titre: "Histoire Moderne", 
                description: "Étude des événements historiques",
                DateCours: "2026-02-02",
                nomClasse: "DS31"
              }
            ]
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          {/* En-tête avec nom de l'étudiant connecté */}
          <div className="mb-4">
            <h3>
              Bonjour,{" "}
              <span className="text-primary">
                {user ? `${user.prenom} ${user.nom}` : "Étudiant"}
              </span> 
              ! 👋
            </h3>
            <p className="text-muted">
              {user ? `Bienvenue sur votre tableau de bord - ${user.email}` : "Connectez-vous pour voir vos données"}
            </p>
          </div>

          {/* Statistiques générales */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card-modern text-center p-3">
                <div className="h4 text-primary">{dashboardData.stats.totalCours}</div>
                <small>Cours disponibles</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-modern text-center p-3">
                <div className="h4 text-success">{dashboardData.stats.examensDisponibles}</div>
                <small>Examens disponibles</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-modern text-center p-3">
                <div className="h4 text-warning">{dashboardData.stats.quizDisponible}</div>
                <small>Quizs disponibles</small>
              </div>
            </div>
          </div>

          {/* Cours récents */}
          <div className="card-modern p-4">
            <h5 className="mb-4">Cours récents</h5>
            <div className="row g-3">
              {dashboardData.coursRecents.map(cours => (
                <div key={cours.idCours} className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <h6>{cours.titre}</h6>
                    <p className="text-muted small mb-2">{cours.description}</p>
                    <div className="small text-muted">
                      <strong>Classe:</strong> {cours.nomClasse}
                    </div>
                    <div className="small text-muted mb-3">
                      <strong>Date:</strong> {new Date(cours.DateCours).toLocaleDateString()}
                    </div>
                    
                    {/* LIEN VERS LA PAGE DÉTAIL DU COURS */}
                    <Link 
                      to={`/cours/${cours.idCours}`}
                      className="btn btn-primary btn-sm w-100"
                    >
                      📖 Voir le cours
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardEtudiant;