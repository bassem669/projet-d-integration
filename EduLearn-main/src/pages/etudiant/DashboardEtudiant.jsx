import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const DashboardEtudiant = () => {
  const [dashboardData, setDashboardData] = useState({ stats: {}, coursRecents: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        
        const profileRes = await fetch("http://localhost:5000/api/profil", {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });
        if (!profileRes.ok) throw new Error("Erreur lors du chargement du profil");
        const profile = await profileRes.json();
        setUser(profile);

        const coursesRes = await fetch("http://localhost:5000/api/inscription/mes-cours", {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });
        if (!coursesRes.ok) throw new Error("Erreur lors du chargement des cours");
        const courses = await coursesRes.json();

        const examsRes = await fetch("http://localhost:5000/api/evaluation/student/evaluations" , {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });; 
        const exams = examsRes.ok ? await examsRes.json() : [];
        const quizRes = await fetch("http://localhost:5000/api/quiz/student/quizzes" , {
          headers: token ? { "Authorization": "Bearer " + token } : {}
        });; 
        const quizzes = quizRes.ok ? await quizRes.json() : [];

        const stats = {
          totalCours: courses.length,
          examensDisponibles: exams.length,
          quizDisponible: quizzes.length
        };

        const recentCourses = courses
          .sort((a, b) => new Date(b.DateCours) - new Date(a.DateCours))
          .slice(0, 3);

        setDashboardData({ stats, coursRecents: recentCourses });
        setLoading(false);

      } catch (err) {
        console.error("Erreur lors du chargement du dashboard:", err);
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
          {/* User greeting */}
          <div className="mb-4">
            <h3>
              Bonjour,{" "}
              <span className="text-primary">{user ? `${user.prenom} ${user.nom}` : "Étudiant"}</span> ! 👋
            </h3>
            <p className="text-muted">
              {user ? `Bienvenue sur votre tableau de bord - ${user.email}` : "Connectez-vous pour voir vos données"}
            </p>
          </div>

          {/* Dashboard stats */}
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

          {/* Recent courses */}
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
                    <Link to={`/cours/${cours.idCours}`} className="btn btn-primary btn-sm w-100">
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
