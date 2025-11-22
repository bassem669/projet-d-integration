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

  const [activeTab, setActiveTab] = useState("accueil");

  const handleLogout = () => {
    localStorage.removeItem("user"); // si tu stockes les infos user
    navigate("/login"); // redirection vers la page de connexion
  };

  const [teacher] = useState({
    name: "Baha",
    surname: "Baha",
    email: "baha@gmail.com",
    createdCourses: 2,
    students: 77,
    unreadMessages: 3,
  });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const [students] = useState([
    { id: 1, name: "Alice Dupont", email: "alice@mail.com", progress: 90 },
    { id: 2, name: "Bob Martin", email: "bob@mail.com", progress: 65 },
    { id: 3, name: "Claire Bernard", email: "claire@mail.com", progress: 80 },
  ]);


  useEffect(() => {
      fetch('http://localhost:5000/api/cours/')
        .then(response => {
          if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
          return response.json();
        })
        .then(data => {
          // 🔁 Adapter les clés backend → frontend
          const mappedCourses = data.map(c => ({
            id: c.idCours,
            title: c.titre,
            description: c.description,
            date: new Date(c.DateCours).toISOString().split('T')[0], // format YYYY-MM-DD
            fileName: c.support || "—",
            teacher: c.nomUtilisateur,
            classe: c.nomClasse
          }));
          setCourses(mappedCourses);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    }, []);

  if (loading) return <p>Chargement des cours...</p>;

  return (
    <>
      <Navbar />  {/* ✅ Navbar affichée en haut */}
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">

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
        </div>

        {/* Contenu principal */}
        <div className="content">
          {activeTab === "accueil" && (
            <>
              <h3>Bonjour, <span className="text-primary">{teacher.name}</span> 👋</h3>

              {/* Statistiques */}
              <div className="row g-4 mb-4">
                <div className="col-sm-6 col-md-3">
                  <div className="card-modern text-center p-3">
                    <FaChalkboardTeacher size={40} className="mb-2 text-primary" />
                    <h6>Cours créés</h6>
                    <h3>{teacher.createdCourses}</h3>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3">
                  <div className="card-modern text-center p-3">
                    <FaUserGraduate size={40} className="mb-2 text-success" />
                    <h6>Étudiants</h6>
                    <h3>{teacher.students}</h3>
                  </div>
                </div>

              </div>

              {/*  Cours récents */}
              <h4 className="mb-3">Cours récents</h4>
              <div className="row g-3 mb-4">
                {[...courses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // tri décroissant par date
                  .slice(0, 3) // garde les 3 plus récents
                  .map((c) => (
                    <div key={c.id} className="col-sm-12 col-md-4">
                      <div className="card-modern p-3 h-100 d-flex flex-column justify-content-between">
                        <h5>{c.title}</h5>
                        <p>Date : {new Date(c.date).toLocaleDateString()}</p>
                        <p>Étudiants inscrits : {c.students}</p>
                      </div>
                    </div>
                  ))}
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
