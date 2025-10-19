import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// 🌸 Pages générales
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Footer from "./pages/footer";

// 👩‍🏫 Tableau de bord enseignant
import TeacherDashboard from "./pages/TeacherDashboard";

// 🎓 Tableau de bord étudiant
import DashboardEtudiant from "./pages/DashboardEtudiant";
import MesCours from "./pages/MesCours";
import Quiz from "./pages/Quiz";
import Progression from "./pages/Progression";
import Profil from "./pages/Profil";

// 🌸 Styles - ORDRE CRUCIAL !
import "./pages/theme_etudiant.css"; 
import "./App.css"; // Styles publics seulement
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Composant pour gérer les classes de layout
function AppContent() {
  const location = useLocation();
  
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className={isPublicPage ? 'public-layout' : 'dashboard-layout'}>
      <Routes>
        {/* 🌸 Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👩‍🏫 Tableau de bord enseignant */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* 🎓 Tableau de bord étudiant */}
        <Route path="/dashboard" element={<DashboardEtudiant />} />
        <Route path="/cours" element={<MesCours />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progression" element={<Progression />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>

      {/* 🌸 Pied de page global - seulement sur les pages publiques */}
      {isPublicPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;