import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Navbar from "../Navbar";
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
  const [currentCourse, setCurrentCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);

  const banners = [banner3, banner2, banner1];

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
    autoplaySpeed: 3000 
  };

  const sliderSettingsCourses = { 
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 3, 
    slidesToScroll: 1, 
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { slidesToShow: 2 } 
      }, 
      { 
        breakpoint: 600, 
        settings: { slidesToShow: 1 } 
      }
    ] 
  };

  const sliderSettingsTeachers = { 
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 4, 
    slidesToScroll: 1, 
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { slidesToShow: 2 } 
      }, 
      { 
        breakpoint: 600, 
        settings: { slidesToShow: 1 } 
      }
    ] 
  };

  // Récupérer l'utilisateur connecté et ses inscriptions
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Récupérer les inscriptions de l'utilisateur
      fetch(`http://localhost:5000/api/etudiants/${parsedUser.idEtudiant}/inscriptions`)
        .then((res) => {
          if (!res.ok) throw new Error("Erreur récupération inscriptions");
          return res.json();
        })
        .then((subscriptions) => setUserSubscriptions(subscriptions))
        .catch((err) => console.error("Erreur lors de la récupération des inscriptions :", err));
    }
  }, []);

  // Récupérer les cours
  useEffect(() => {
    fetch(`http://localhost:5000/api/cours`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur récupération cours");
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => console.error("Erreur lors de la récupération des cours :", err));
  }, []);

  const handleCourseClick = (course) => {
    // Si l'utilisateur n'est pas connecté
    if (!user) {
      setCurrentCourse(course);
      setIsModalOpen(true);
      return;
    }

    // Vérifier si l'utilisateur est inscrit à ce cours
    const isSubscribed = userSubscriptions.some(sub => sub.idCours === course.idCours);
    
    if (isSubscribed) {
      // Rediriger vers la page de détails du cours
      navigate(`/cours/${course.idCours}`);
    } else {
      // Afficher la modal pour s'inscrire au cours
      setCurrentCourse(course);
      setIsModalOpen(true);
    }
  };

  const handleViewCourse = (courseId, e) => {
    e.stopPropagation(); // Empêcher le déclenchement du handleCourseClick
    navigate(`/cours/${courseId}`);
  };

  const handleSubscribeToCourse = () => {
    if (!user || !currentCourse) return;

    // Appel API pour s'inscrire au cours
    fetch(`http://localhost:5000/api/etudiants/${user.idEtudiant}/inscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idCours: currentCourse.idCours,
        idEtudiant: user.idEtudiant
      })
    })
    .then((res) => {
      if (!res.ok) throw new Error("Erreur lors de l'inscription");
      return res.json();
    })
    .then((data) => {
      setUserSubscriptions([...userSubscriptions, { idCours: currentCourse.idCours }]);
      navigate(`/cours/${currentCourse.idCours}`);
      setIsModalOpen(false);
    })
    .catch((err) => {
      console.error("Erreur lors de l'inscription au cours :", err);
      alert("Erreur lors de l'inscription au cours");
    });
  };

  const getModalContent = () => {
    if (!user) {
      return {
        title: "Connexion requise",
        message: "Pour accéder à nos cours, vous devez vous connecter en tant qu'étudiant.",
        primaryButton: { text: "Se connecter", action: () => navigate("/login") },
        secondaryButton: { text: "S'inscrire", action: () => navigate("/register") }
      };
    } else {
      return {
        title: "Inscription au cours requis",
        message: `Vous n'êtes pas encore inscrit au cours "${currentCourse?.titre}". Souhaitez-vous vous inscrire ?`,
        primaryButton: { text: "S'inscrire au cours", action: handleSubscribeToCourse },
        secondaryButton: { text: "Annuler", action: () => setIsModalOpen(false) }
      };
    }
  };

  const modalContent = getModalContent();

  return (
    <div className="home-page">
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
          {courses.map((course) => {
            const isUserSubscribed = user && userSubscriptions.some(sub => sub.idCours === course.idCours);
            
            return (
              <div className="course-card" key={course.idCours}>
                <h3>{course.titre}</h3>
                <p>{course.description}</p>
                <p><strong>Classe :</strong> {course.nomClasse}</p>
                
                {/* Indicateur d'état */}
                {!user && (
                  <div className="course-status not-logged-in">
                    🔒 Connectez-vous pour accéder
                  </div>
                )}
                {user && isUserSubscribed && (
                  <div className="course-status subscribed">
                    ✅ Vous êtes inscrit
                  </div>
                )}
                {user && !isUserSubscribed && (
                  <div className="course-status not-subscribed">
                    📝 Inscription requise
                  </div>
                )}
                
                {/* Boutons d'action */}
                <div className="course-actions">
                  {!user && (
                    <button 
                      className="btn-primary"
                      onClick={() => handleCourseClick(course)}
                    >
                      Voir le cours
                    </button>
                  )}
                  
                  {user && isUserSubscribed && (
                    <button 
                      className="btn-success"
                      onClick={(e) => handleViewCourse(course.idCours, e)}
                    >
                      Voir le cours
                    </button>
                  )}
                  
                  {user && !isUserSubscribed && (
                    <button 
                      className="btn-secondary"
                      onClick={() => handleCourseClick(course)}
                    >
                      S'inscrire au cours
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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

      {/* Modal dynamique */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <h2>{modalContent.title}</h2>
        <p>{modalContent.message}</p>
        <div className="modal-buttons">
          <button onClick={modalContent.primaryButton.action} className="btn-primary">
            {modalContent.primaryButton.text}
          </button>
          <button onClick={modalContent.secondaryButton.action} className="btn-secondary">
            {modalContent.secondaryButton.text}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;