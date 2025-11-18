import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// 🌸 Pages générales
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Footer from "./pages/footer/footer";
import Contact from "./pages/contact/contact";

// 👩‍🏫 Tableau de bord enseignant
import TeacherDashboard from "./pages/enseignant/TeacherDashboard";

// 🎓 Tableau de bord étudiant
import DashboardEtudiant from "./pages/etudiant/DashboardEtudiant";
import MesCours from "./pages/etudiant/MesCours";
import Quiz from "./pages/etudiant/Quiz";
import DetailQuiz from "./pages/etudiant/DetailQuiz";
import Profil from "./pages/etudiant/Profil";
import DetailCours from "./pages/etudiant/DetailCours";

// 🛠️ Tableau de bord administrateur
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import UsersManagement from "./pages/admin/UsersManagement";
import CourseModeration from "./pages/admin/CourseModeration";
import LogsAudit from "./pages/admin/LogsAudit";
import SecuritySettings from "./pages/admin/SecuritySettings";
import Backup from "./pages/admin/Backup";

// 🌸 Styles - ORDRE CRUCIAL !
import "./pages/etudiant/theme_etudiant.css";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 🧭 Composant interne pour gérer les routes + le layout
function AppContent() {
  const location = useLocation();

  // Pages publiques où le footer doit apparaître
  const pagesAvecFooter = ["/", "/contact"];

  // On cache le footer sur login, register et dashboards
  const afficherFooter = pagesAvecFooter.includes(location.pathname);

  return (
    <div
      className={
        ["/", "/login", "/register", "/contact"].includes(location.pathname)
          ? "public-layout"
          : "dashboard-layout"
      }
    >
      <Routes>
        {/* 🌸 Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👩‍🏫 Tableau de bord enseignant */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* 🎓 Tableau de bord étudiant */}
        <Route path="/dashboard" element={<DashboardEtudiant />} />
        <Route path="/cours" element={<MesCours />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:id" element={<DetailQuiz />} />

        <Route path="/profil" element={<Profil />} />
        <Route path="/cours/:id" element={<DetailCours />} />

        {/* 🛠️ Tableau de bord administrateur */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="courses" element={<CourseModeration />} />
          <Route path="logs" element={<LogsAudit />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="backup" element={<Backup />} />
        </Route>
      </Routes>

      {/* 🌸 Footer visible uniquement sur les pages publiques */}
      {afficherFooter && <Footer />}
    </div>
  );
}

// 🌐 Composant principal
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
