import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import './footer.css';
import logo from '../../assets/logo_edu.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo et description */}
        <div className="footer-section">
          <div className="footer-top">
            <Link to="/">
                <img src={logo} alt="Logo" className="footer-logo" />
            </Link>
          <p>
            Apprenez et partagez vos connaissances avec vos enseignants et étudiants.  
            Rejoignez notre communauté pour grandir ensemble !
          </p>
         </div>
        </div>

        {/* Liens utiles */}
        <div className="footer-section">
          <h4>Liens</h4>
          <ul>
            <li><a href="/courses">Cours</a></li>
            <li><a href="/teachers">Professeurs</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EduLearn. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
