import React from "react";
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBookOpen,
  FaChartBar,
  FaUserCircle,
  FaQuestionCircle,
  FaComments
} from "react-icons/fa";

export default function MenuEtudiant() {
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", path: "/dashboard", label: "Tableau de bord", icon: FaHome },
    { id: "cours", path: "/cours", label: "Mes cours", icon: FaBookOpen },
    { id: "forum", path: "/forum", label: "Forums", icon: FaComments },
    { id: "quiz", path: "/quiz", label: "Quiz & Évaluations", icon: FaQuestionCircle },
    { id: "profil", path: "/profil", label: "Mon profil", icon: FaUserCircle }

  ];

  return (
    <div className="sidebar">
      {/* Logo/Header harmonisé avec enseignant */}
      <div className="dashboard-logo">
        <span>Espace Étudiant</span>
      </div>
      
      {/* Menu items */}
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path || 
                            (location.pathname === '/' && item.path === '/dashboard');
            
            return (
              <li key={item.id} className="sidebar-item">
                <Link
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <IconComponent className="sidebar-icon" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}