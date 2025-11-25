// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './AdminDashboard.css';
import { LayoutDashboard, Users, BookOpen, Shield, FileText, Download, LogOut, Bell } from 'lucide-react';
import logo from "../../assets/logo_edu.png";
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();
    
    // Récupérer l'utilisateur depuis le localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Extraire les informations de l'utilisateur
    const userName = userData.nom || userData.prenom || userData.email || "Administrateur";
    const userEmail = userData.email || "admin@edulearn.com";
    const userRole = userData.role || "Admin";
    const userInitials = getUserInitials(userData);

    // Fonction pour générer les initiales
    function getUserInitials(user) {
        if (user.nom && user.prenom) {
            return (user.prenom.charAt(0) + user.nom.charAt(0)).toUpperCase();
        } else if (user.nom) {
            return user.nom.charAt(0).toUpperCase();
        } else if (user.prenom) {
            return user.prenom.charAt(0).toUpperCase();
        } else if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "AD";
    }

    const handleLogout = () => {
        // Supprime les informations de l'utilisateur
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Redirection vers la page de connexion
        navigate("/login");
    };

    return (
        <div className="admin-dashboard-container">
            {/* TOP NAV */}
            <header className="admin-top-nav">
                <div className="admin-top-left">
                    <img src={logo} alt="EduLearn" className="logo-image" />
                </div>

                <div className="admin-top-right">
                    {/* Profil admin */}
                    <div className="admin-profile-wrapper">
                        <div className="admin-profile-info">
                            <div className="admin-name">{userName}</div>
                            <div className="admin-email">{userEmail}</div>
                            <div className="admin-role">Rôle : {userRole}</div>
                        </div>
                        <div className="admin-profile-pic">{userInitials}</div>
                    </div>
                </div>
            </header>

            <div className="admin-layout">
                {/* SIDEBAR */}
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <h2>Admin Panel</h2>
                        <div className="user-welcome">
                            Bonjour, <strong>{userName.split(' ')[0]}</strong>
                        </div>
                    </div>
                    <ul className="admin-sidebar-menu">
                        <li>
                            <NavLink to="/admin" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`} end>
                                <LayoutDashboard size={22} />
                                <span>Tableau de bord</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/users" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
                                <Users size={22} />
                                <span>Gestion utilisateurs</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/courses" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
                                <BookOpen size={22} />
                                <span>Modération cours</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/logs" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
                                <FileText size={22} />
                                <span>Logs & Audit</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/security" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
                                <Shield size={22} />
                                <span>Sécurité</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/backup" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
                                <Download size={22} />
                                <span>Sauvegarde</span>
                            </NavLink>
                        </li>
                        <li>
                            {/* Bouton déconnexion */}
                            <button onClick={handleLogout} className="admin-logout-button">
                                <LogOut size={20} />
                                <span>Déconnexion</span>
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* CONTENU QUI CHANGE */}
                <main className="admin-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;