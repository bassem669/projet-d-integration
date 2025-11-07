import React, { useState } from "react";
import logo from "../../images/logo1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaEnvelopeOpenText,
  FaUserCircle,
  FaBookOpen,
  FaListAlt
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from "recharts";
import "./TeacherDashboard.css";

import Profil from "./Profil";
import Cours from "./Cours";
import Etudiants from "./Etudiants";
import Resultats from "./Resultats";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("accueil");

  const [teacher] = useState({
    name: "Baha",
    surname: "Baha",
    email: "baha@gmail.com",
    createdCourses: 2,
    students: 77,
    unreadMessages: 3,
  });

  const [courses] = useState([
    { id: 1, title: "Mathématiques", students: 35, date: "2025-10-01", type: "PDF", progress: 70 },
    { id: 2, title: "Programmation", students: 42, date: "2025-10-05", type: "PowerPoint", progress: 40 },
    { id: 3, title: "Physique", students: 30, date: "2025-09-28", type: "PDF", progress: 55 },
    { id: 4, title: "Chimie", students: 28, date: "2025-09-20", type: "Word", progress: 85 },
  ]);

  const [students] = useState([
    { id: 1, name: "Alice Dupont", email: "alice@mail.com", progress: 90 },
    { id: 2, name: "Bob Martin", email: "bob@mail.com", progress: 65 },
    { id: 3, name: "Claire Bernard", email: "claire@mail.com", progress: 80 },
  ]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "250px", height: "180px", objectFit: "contain", marginBottom: "10px" }}
        />
        <ul className="list-unstyled flex-grow-1">
          <li className={`sidebar-item ${activeTab === "accueil" ? "active" : ""}`} onClick={() => setActiveTab("accueil")}>
            <FaChalkboardTeacher /> Accueil
          </li>
          <li className={`sidebar-item ${activeTab === "cours" ? "active" : ""}`} onClick={() => setActiveTab("cours")}>
            <FaBookOpen /> Mes cours
          </li>
          <li className={`sidebar-item ${activeTab === "etudiants" ? "active" : ""}`} onClick={() => setActiveTab("etudiants")}>
            <FaUserGraduate /> Étudiants
          </li>
          <li className={`sidebar-item ${activeTab === "resultats" ? "active" : ""}`} onClick={() => setActiveTab("resultats")}>
            <FaListAlt /> Résultats
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

              <div className="col-sm-6 col-md-3">
                <div className="card-modern text-center p-3">
                  <FaEnvelopeOpenText size={40} className="mb-2 text-danger" />
                  <h6>Messages non lus</h6>
                  <h3>{teacher.unreadMessages}</h3>
                </div>
              </div>

              <div className="col-sm-6 col-md-3">
                <div className="card-modern text-center p-3">
                  <FaListAlt size={40} className="mb-2 text-warning" />
                  <h6>Progression moyenne</h6>
                  <h3>
                    {students.length
                      ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
                      : 0}%
                  </h3>
                </div>
              </div>
            </div>

            {/* Graphique */}
            <div className="mb-4">
              <h4>Progression des cours</h4>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courses} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#1e3a8a" radius={[5,5,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                      <div className="progress-modern mb-2">
                        <div
                          className="progress-bar"
                          style={{ width: `${c.progress}%` }}
                        ></div>
                      </div>
                      <span>Progression : {c.progress}%</span>
                    </div>
                  </div>
                ))}
            </div>

          </>
        )}

        {activeTab === "cours" && <Cours />}
        {activeTab === "etudiants" && <Etudiants />}
        {activeTab === "resultats" && <Resultats />}
        {activeTab === "profil" && <Profil />}
      </div>
    </div>
  );
}
