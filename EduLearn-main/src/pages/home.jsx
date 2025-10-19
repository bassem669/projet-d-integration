import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "../assets/logo_edu.png";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import course1 from "../assets/math.png";
import course2 from "../assets/eng.png";
import course3 from "../assets/info.png";
import course4 from "../assets/arabe.png";
import course5 from "../assets/mec.png";
import course6 from "../assets/sci.png";
import teacher1 from "../assets/teacher1.jpg";
import teacher2 from "../assets/teacher2.jpg";
import teacher3 from "../assets/teacher3.jpg";
import teacher4 from "../assets/teacher4.jpg";
import teacher5 from "../assets/teacher5.jpg";

function Home() {
  const banners = [banner3, banner2, banner1];

  const courses = [
    { img: course1, name: "Mathématiques", desc: "Cours de mathématiques pour débutants." },
    { img: course2, name: "Anglais", desc: "Améliorez votre niveau d'anglais." },
    { img: course3, name: "Informatique", desc: "Introduction à la programmation." },
    { img: course4, name: "Arabe", desc: "Cours de langue arabe pour débutants." },
    { img: course6, name: "Science", desc: "Introduction aux concepts scientifiques." },
    { img: course5, name: "Mécanique", desc: "Bases de la mécanique et de l'ingénierie." },
  ];

  const teachers = [
    { img: teacher1, name: "Mme Dupont", subject: "Mathématiques" },
    { img: teacher2, name: "M. Martin", subject: "Physique" },
    { img: teacher3, name: "Mme Leroy", subject: "Informatique" },
    { img: teacher4, name: "M. Bernard", subject: "Anglais" },
    { img: teacher5, name: "Mme Simon", subject: "Histoire" },
  ];

  const sliderSettingsHero = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const sliderSettingsCourses = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const sliderSettingsTeachers = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="nav-left">
            <Link to="/">
                <img src={logo} alt="Logo" className="home-logo" />
            </Link>
        </div>
        <div className="nav-right">
            <div className="nav-links-main">
                <Link to="#courses">Cours</Link>
                <Link to="#teachers">Professeurs</Link>
                <Link to="#contact">Contact</Link>
            </div>
            <div className="nav-dropdown">
        <button className="dropbtn">Compte ▼</button>
        <div className="dropdown-content">
            <Link to="/login">
            <FaSignInAlt style={{ marginRight: "8px" }} /> Connexion
            </Link>
            <Link to="/register">
            <FaUserPlus style={{ marginRight: "8px" }} /> Inscription
            </Link>
        </div>
        </div>
        </div>
        </nav>

      {/* Hero Section */}
        <section className="hero-section">
        <div className="hero-slider">
            <Slider {...sliderSettingsHero}>
            {banners.map((img, index) => (
                <div key={index} className="hero-slide">
                <img src={img} alt={`Slide ${index + 1}`} />
                <div className="hero-overlay">
                    <Link to="/register" className="cta-button">Rejoignez-nous!</Link>
                </div>
                </div>
            ))}
            </Slider>
        </div>
        </section>

      {/* Section Cours */}
      <section className="courses-section">
        <h2>Nos Cours</h2>
        <Slider {...sliderSettingsCourses}>
          {courses.map((course, index) => (
            <div className="course-card" key={index}>
              <img src={course.img} alt={course.name} />
              <h3>{course.name}</h3>
              <p>{course.desc}</p>
            </div>
          ))}
        </Slider>
      </section>

      {/* Section Professeurs */}
      <section className="teachers-section">
        <h2>Nos Professeurs</h2>
        <Slider {...sliderSettingsTeachers}>
          {teachers.map((teacher, index) => (
            <div className="teacher-card" key={index}>
              <img src={teacher.img} alt={teacher.name} />
              <h3>{teacher.name}</h3>
              <p>{teacher.subject}</p>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}

export default Home;
