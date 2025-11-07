import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logo_edu.png";
import "./contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message envoyé avec succès !");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Navigation identique à Home */}
      <nav className="home-nav">
        <div className="nav-left">
          <Link to="/">
            <img src={logo} alt="Logo" className="home-logo" />
          </Link>
        </div>
        <div className="nav-right">
          <div className="nav-links-main">
            <Link to="/">Accueil</Link>
            <Link to="/#courses">Cours</Link>
            <Link to="/#teachers">Professeurs</Link>
            <Link to="/contact" className="active">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <section className="contact-section">
        <h2>Contactez-nous</h2>
        <p>Remplissez le formulaire ci-dessous pour nous envoyer un message.</p>

        <div className="contact-container">
          {/* Formulaire */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Votre message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Envoyer</button>
          </form>

          {/* Infos de contact */}
          <div className="contact-info">
            <h3>Nos coordonnées</h3>
            <p><FaMapMarkerAlt /> Avenue de l'Éducation, Tunis</p>
            <p><FaPhoneAlt /> +216 22 345 678</p>
            <p><FaEnvelope /> contact@educonnect.tn</p>
          </div>
        </div>

        {/* Carte Google (facultatif) */}
        <div className="map-container">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.016501!2d10.1844!3d36.8065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34f!2sTunis!5e0!3m2!1sfr!2stn!4v1670000000000"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Contact;
