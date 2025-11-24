import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaEnvelopeOpenText,
  FaUserCircle,
  FaBookOpen,
  FaQuestionCircle,
} from "react-icons/fa";
import "./TeacherDashboard.css";

import Profil from "./Profil";
import Cours from "./Cours";
import QuizManagement from "./QuizManagement";
import Etudiants from "./Etudiants";
import Resultats from "./Resultats";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  // Récupération de l'utilisateur connecté depuis localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  const [activeTab, setActiveTab] = useState("accueil");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [teacherStats, setTeacherStats] = useState({
    createdCourses: 0,
    students: 0
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Récupérer uniquement les cours de l'enseignant connecté
    fetch(`http://localhost:5000/api/cours/enseignant/${user.idUtilisateur}`)
      .then(response => {
        if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
        return response.json();
      })
      .then(data => {
        const mappedCourses = data.map(c => ({
          id: c.idCours,
          title: c.titre,
          description: c.description,
          date: new Date(c.DateCours).toISOString().split('T')[0],
          fileName: c.support || "—",
          teacher: c.nomUtilisateur,
          classe: c.nomClasse,
          students: c.nombreEtudiants || 0 // Ajout du nombre d'étudiants
        }));
        
        setCourses(mappedCourses);
        
        // Calcul des statistiques
        setTeacherStats({
          createdCourses: mappedCourses.length,
          students: mappedCourses.reduce((total, course) => total + (course.students || 0), 0)
        });
        
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [user, navigate]);

  // Redirection si utilisateur non connecté
  if (!user) {
    return null; // ou un composant de chargement
  }

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
      <span className="ms-2">Chargement de votre tableau de bord...</span>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          {/* En-tête avec informations de l'enseignant */}
          <div className="sidebar-header p-3 text-center border-bottom">
            <FaUserCircle size={40} className="text-primary mb-2" />
            <h6 className="mb-1">{user.nom} {user.prenom}</h6>
            <small className="text-muted">{user.email}</small>
            <div className="mt-2">
              <span className="badge bg-primary">Enseignant</span>
            </div>
          </div>

          <ul className="list-unstyled flex-grow-1">
            <li className={`sidebar-item ${activeTab === "accueil" ? "active" : ""}`} onClick={() => setActiveTab("accueil")}>
              <FaChalkboardTeacher /> Accueil
            </li>
            <li className={`sidebar-item ${activeTab === "cours" ? "active" : ""}`} onClick={() => setActiveTab("cours")}>
              <FaBookOpen /> Mes cours
            </li>
            <li className={`sidebar-item ${activeTab === "quiz" ? "active" : ""}`} onClick={() => setActiveTab("quiz")}>
              <FaQuestionCircle /> Quiz et Evaluation
            </li>
            <li className={`sidebar-item ${activeTab === "etudiants" ? "active" : ""}`} onClick={() => setActiveTab("etudiants")}>
              <FaUserGraduate /> Étudiants
            </li>
            <li className={`sidebar-item ${activeTab === "profil" ? "active" : ""}`} onClick={() => setActiveTab("profil")}>
              <FaUserCircle /> Profil
            </li>
          </ul>

          {/* Pied de sidebar avec bouton déconnexion */}
          <div className="sidebar-footer p-3 border-top">
            <button 
              className="btn btn-outline-danger btn-sm w-100"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="content">
          {activeTab === "accueil" && (
            <>
              <h3>Bonjour, <span className="text-primary">{user.prenom} {user.nom}</span> 👋</h3>
              <p className="text-muted">Bienvenue sur votre tableau de bord enseignant</p>

              {/* Statistiques */}
              <div className="row g-4 mb-4">
                <div className="col-sm-6 col-md-3">
                  <div className="card-modern text-center p-3">
                    <FaChalkboardTeacher size={40} className="mb-2 text-primary" />
                    <h6>Cours créés</h6>
                    <h3>{teacherStats.createdCourses}</h3>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3">
                  <div className="card-modern text-center p-3">
                    <FaUserGraduate size={40} className="mb-2 text-success" />
                    <h6>Étudiants total</h6>
                    <h3>{teacherStats.students}</h3>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3">
                  <div className="card-modern text-center p-3">
                    <FaBookOpen size={40} className="mb-2 text-warning" />
                    <h6>Cours ce mois</h6>
                    <h3>
                      {courses.filter(course => {
                        const courseDate = new Date(course.date);
                        const now = new Date();
                        return courseDate.getMonth() === now.getMonth() && 
                               courseDate.getFullYear() === now.getFullYear();
                      }).length}
                    </h3>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3">
                  <div className="card-modern text-center p-3">
                    <FaEnvelopeOpenText size={40} className="mb-2 text-info" />
                    <h6>Classes</h6>
                    <h3>
                      {new Set(courses.map(course => course.classe)).size}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Cours récents */}
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Vos cours récents</h4>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveTab("cours")}
                    >
                      Voir tous les cours
                    </button>
                  </div>
                  
                  {courses.length > 0 ? (
                    <div className="row g-3 mb-4">
                      {[...courses]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 3)
                        .map((c) => (
                          <div key={c.id} className="col-sm-12 col-md-4">
                            <div className="card-modern p-3 h-100 d-flex flex-column">
                              <h5 className="text-primary">{c.title}</h5>
                              <p className="text-muted small">{c.description}</p>
                              <div className="mt-auto">
                                <p className="mb-1">
                                  <strong>Date :</strong> {new Date(c.date).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="mb-1">
                                  <strong>Classe :</strong> {c.classe || 'Non assigné'}
                                </p>
                                <p className="mb-0">
                                  <strong>Étudiants :</strong> {c.students || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaBookOpen size={50} className="text-muted mb-3" />
                      <h5 className="text-muted">Aucun cours créé</h5>
                      <p className="text-muted">Commencez par créer votre premier cours</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveTab("cours")}
                      >
                        Créer un cours
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "cours" && <Cours />}
          {activeTab === "etudiants" && <Etudiants />}
          {activeTab === "quiz" && <QuizManagement />}
          {activeTab === "resultats" && <Resultats />}
          {activeTab === "profil" && <Profil />}
        </div>
      </div>
    </>
  );
}