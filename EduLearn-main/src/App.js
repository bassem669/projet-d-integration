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

import PrivateRoute from "./utils/PrivateRoute";

// Styles
import "./pages/etudiant/theme_etudiant.css";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Unauthorized from "./pages/Unauthorized";
import ForgotPasswordEmail from "./pages/forget password/ForgotPasswordEmail";
import ForgotPasswordCode from "./pages/forget password/ForgotPasswordCode";
import ForgotPasswordNew from "./pages/forget password/ForgotPasswordNew";

function AppContent() {
  const location = useLocation();

  const pagesAvecFooter = ["/", "/contact"];
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
        <Route path="/forgot-password" element={<ForgotPasswordEmail/>}/>
        <Route path="/forgot-password/Code" element={<ForgotPasswordCode/>}/>
        <Route path="/forgot-password/new" element={<ForgotPasswordNew/>}/>
        <Route path="/unauthorized" element={<Unauthorized />} />


        {/* 👩‍🏫 Tableau de bord enseignant */}
        <Route
          path="/teacher-dashboard"
          element={
            <PrivateRoute roles={["enseignant"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        {/* 🎓 Tableau de bord étudiant */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["etudiant"]}>
              <DashboardEtudiant />
            </PrivateRoute>
          }
        />

        <Route
          path="/cours"
          element={
            <PrivateRoute roles={["etudiant"]}>
              <MesCours />
            </PrivateRoute>
          }
        />

        <Route
          path="/cours/:id"
          element={
            <PrivateRoute roles={["etudiant"]}>
              <DetailCours />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <PrivateRoute roles={["etudiant"]}>
              <Quiz />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute roles={["etudiant"]}>
              <DetailQuiz />
            </PrivateRoute>
          }
        />

        <Route
          path="/profil"
          element={
            <PrivateRoute roles={["etudiant"]}>
              <Profil />
            </PrivateRoute>
          }
        />

        {/* 🛠️ Tableau de bord administrateur */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="users"
            element={
              <PrivateRoute roles={["admin"]}>
                <UsersManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="courses"
            element={
              <PrivateRoute roles={["admin"]}>
                <CourseModeration />
              </PrivateRoute>
            }
          />

          <Route
            path="logs"
            element={
              <PrivateRoute roles={["admin"]}>
                <LogsAudit />
              </PrivateRoute>
            }
          />

          <Route
            path="security"
            element={
              <PrivateRoute roles={["admin"]}>
                <SecuritySettings />
              </PrivateRoute>
            }
          />

          <Route
            path="backup"
            element={
              <PrivateRoute roles={["admin"]}>
                <Backup />
              </PrivateRoute>
            }
          />
        </Route>

      </Routes>


      {afficherFooter && <Footer />}
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
