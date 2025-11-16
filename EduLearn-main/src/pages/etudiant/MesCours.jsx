import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import de Link
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const MesCours = () => {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation appel API
    setTimeout(() => {
      setCours([
        { 
          idCours: 3, 
          titre: "Mathématiques Avancées", 
          description: "Cours complet sur les concepts avancés des mathématiques modernes", 
          DateCours: "2025-11-11",
          nomClasse: "DS31",
          nomUtilisateur: "Prof. Martin"
        },
        { 
          idCours: 4, 
          titre: "Programmation Web", 
          description: "Apprenez à créer des sites web modernes avec les dernières technologies", 
          DateCours: "2026-02-01",
          nomClasse: "DS31",
          nomUtilisateur: "Prof. Dubois"
        },
        { 
          idCours: 5, 
          titre: "Histoire Moderne", 
          description: "Étude des événements historiques du 20ème siècle à nos jours", 
          DateCours: "2026-02-02",
          nomClasse: "DS31",
          nomUtilisateur: "Prof. Bernard"
        }
      ]);
      setLoading(false);
    }, 500);
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
          <h3 className="mb-4">Mes Cours</h3>
          
          <div className="row g-4">
            {cours.map(cours => (
              <div key={cours.idCours} className="col-md-6 col-lg-4">
                <div className="card-modern p-3 h-100">
                  <h5>{cours.titre}</h5>
                  <p className="text-muted small">{cours.description}</p>
                  
                  <div className="mt-auto">
                    <div className="small text-muted mb-2">
                      <strong>Enseignant:</strong> {cours.nomUtilisateur}
                    </div>
                    <div className="small text-muted mb-2">
                      <strong>Classe:</strong> {cours.nomClasse}
                    </div>
                    <div className="small text-muted mb-3">
                      <strong>Date:</strong> {new Date(cours.DateCours).toLocaleDateString()}
                    </div>
                    
                    {/* LIEN VERS LA PAGE DETAIL */}
                    <Link 
                      to={`/cours/${cours.idCours}`} 
                      className="btn btn-primary btn-sm w-100"
                    >
                      📖 Accéder au cours
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MesCours;