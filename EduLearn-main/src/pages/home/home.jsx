import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Navbar from "../Navbar"; // <-- importer ton composant Navbar
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import teacher1 from "../../assets/teacher1.jpg";
import teacher2 from "../../assets/teacher2.jpg";
import teacher3 from "../../assets/teacher3.jpg";
import teacher4 from "../../assets/teacher4.jpg";
import teacher5 from "../../assets/teacher5.jpg";

function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  const banners = [banner3, banner2, banner1];

  const teachers = [
    { img: teacher1, name: "Mme Dupont", subject: "Mathématiques" },
    { img: teacher2, name: "M. Martin", subject: "Physique" },
    { img: teacher3, name: "Mme Leroy", subject: "Informatique" },
    { img: teacher4, name: "M. Bernard", subject: "Anglais" },
    { img: teacher5, name: "Mme Simon", subject: "Histoire" },
  ];

  const sliderSettingsHero = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000 };
  const sliderSettingsCourses = { dots: true, infinite: true, speed: 500, slidesToShow: 3, slidesToScroll: 1, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 600, settings: { slidesToShow: 1 } }] };
  const sliderSettingsTeachers = { dots: true, infinite: true, speed: 500, slidesToShow: 4, slidesToScroll: 1, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 600, settings: { slidesToShow: 1 } }] };

  useEffect(() => {
  fetch(`http://localhost:5000/api/cours`)
    .then((res) => {
      if (!res.ok) throw new Error("Erreur récupération cours");
      return res.json();
    })
    .then((data) => setCourses(data))
    .catch((err) => console.error("Erreur lors de la récupération des cours :", err));
}, []);



  const handleCourseClick = () => setIsModalOpen(true);

  return (
    <div className="home-page">
      {/* Utilisation du composant Navbar */}
      <Navbar />

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
      <section className="courses-section" id="courses">
        <h2>Nos Cours</h2>
        <Slider {...sliderSettingsCourses}>
          {courses.map((course) => (
            <div className="course-card" key={course.idCours} onClick={handleCourseClick}>
              <h3>{course.titre}</h3>
              <p>{course.description}</p>
              <p><strong>Classe :</strong> {course.nomClasse}</p>
              {course.support && <a href={course.support} target="_blank" rel="noopener noreferrer">Télécharger le support</a>}
            </div>
          ))}
        </Slider>
      </section>

      {/* Section Professeurs */}
      <section className="teachers-section" id="teachers">
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

      {/* Popup inscription */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <h2>Inscription requise</h2>
        <p>Pour participer à nos cours, vous devez vous inscrire d’abord.</p>
        <div className="modal-buttons">
          <button onClick={() => navigate("/register")} className="btn-primary">S'inscrire</button>
          <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Annuler</button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
