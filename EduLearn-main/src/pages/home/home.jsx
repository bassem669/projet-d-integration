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
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const banners = [banner3, banner2, banner1];

  // Images par défaut pour les enseignants
  const defaultTeacherImages = [teacher1, teacher2, teacher3, teacher4, teacher5];

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

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (userData && token) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Récupérer les inscriptions de l'utilisateur seulement si c'est un étudiant
      if (parsedUser.role === 'etudiant') {
        fetchUserSubscriptions(token);
      }
    }
  }, []);

  // Récupérer les cours
  useEffect(() => {
    fetchCourses();
  }, []);

  // Récupérer les enseignants
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fonction pour récupérer les enseignants depuis l'API
  const fetchTeachers = async () => {
    try {
      setTeachersLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/enseignants');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des enseignants');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Associer une image par défaut à chaque enseignant
        const teachersWithImages = data.data.map((teacher, index) => ({
          ...teacher,
          img: defaultTeacherImages[index % defaultTeacherImages.length], // Cycle through default images
          subject: getRandomSubject() // Ajouter une matière aléatoire pour l'affichage
        }));
        
        setTeachers(teachersWithImages);
      }
    } catch (error) {
      console.error('Erreur fetchTeachers:', error);
      // En cas d'erreur, utiliser les enseignants par défaut
      setTeachers([
        { id: 1, nom: "Dupont", prenom: "Marie", img: teacher1, subject: "Mathématiques" },
        { id: 2, nom: "Martin", prenom: "Pierre", img: teacher2, subject: "Physique" },
        { id: 3, nom: "Leroy", prenom: "Sophie", img: teacher3, subject: "Informatique" },
        { id: 4, nom: "Bernard", prenom: "Jean", img: teacher4, subject: "Anglais" },
        { id: 5, nom: "Simon", prenom: "Claire", img: teacher5, subject: "Histoire" }
      ]);
    } finally {
      setTeachersLoading(false);
    }
  };

  // Fonction utilitaire pour générer une matière aléatoire
  const getRandomSubject = () => {
    const subjects = [
      "Mathématiques", "Physique", "Chimie", "Informatique", "Français",
      "Anglais", "Histoire", "Géographie", "Philosophie", "SVT",
      "Économie", "Droit", "Marketing", "Programmation", "Design"
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  };

  // Fonction pour récupérer les inscriptions de l'utilisateur
  const fetchUserSubscriptions = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inscription/mes-cours`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Erreur récupération inscriptions");
      const subscriptions = await response.json();
      
      // Transformer les données pour avoir un format cohérent
      const formattedSubscriptions = subscriptions.map(course => ({
        idCours: course.idCours,
        idInscription: course.idInscription || Date.now()
      }));
      
      setUserSubscriptions(formattedSubscriptions);
    } catch (err) {
      console.error("Erreur lors de la récupération des inscriptions :", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`http://localhost:5000/api/cours`, { headers });
      
      if (!response.ok) throw new Error("Erreur récupération cours");
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des cours :", err);
    }
  };

  const handleCourseClick = (course) => {
    if (!user) {
      setCurrentCourse(course);
      setIsModalOpen(true);
      return;
    }

    if (user.role !== 'etudiant') {
      setCurrentCourse(course);
      setIsModalOpen(true);
      return;
    }

    const isSubscribed = userSubscriptions.some(sub => sub.idCours === course.idCours);
    
    if (isSubscribed) {
      navigate(`/cours/${course.idCours}`);
    } else {
      setCurrentCourse(course);
      setIsModalOpen(true);
    }
  };

  const handleViewCourse = (courseId, e) => {
    e.stopPropagation();
    navigate(`/cours/${courseId}`);
  };

  const handleSubscribeToCourse = async () => {
    if (!user || !currentCourse) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idCours: currentCourse.idCours
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      await fetchUserSubscriptions(token);
      navigate(`/cours/${currentCourse.idCours}`);
      setIsModalOpen(false);
      
    } catch (err) {
      console.error("Erreur lors de l'inscription au cours :", err);
      alert(err.message || "Erreur lors de l'inscription au cours");
    } finally {
      setLoading(false);
    }
  };

  const getModalContent = () => {
    if (!user) {
      return {
        title: "Connexion requise",
        message: "Pour accéder à nos cours, vous devez vous connecter en tant qu'étudiant.",
        primaryButton: { 
          text: "Se connecter", 
          action: () => navigate("/login"),
          disabled: false
        },
        secondaryButton: { 
          text: "S'inscrire", 
          action: () => navigate("/register"),
          disabled: false
        }
      };
    } else if (user.role !== 'etudiant') {
      return {
        title: "Accès réservé aux étudiants",
        message: "Cette fonctionnalité est uniquement disponible pour les étudiants.",
        primaryButton: { 
          text: "Comprendre", 
          action: () => setIsModalOpen(false),
          disabled: false
        },
        secondaryButton: { 
          text: "Fermer", 
          action: () => setIsModalOpen(false),
          disabled: false
        }
      };
    } else {
      return {
        title: "Inscription au cours",
        message: `Vous n'êtes pas encore inscrit au cours "${currentCourse?.titre}". Souhaitez-vous vous inscrire ?`,
        primaryButton: { 
          text: loading ? "Inscription en cours..." : "S'inscrire au cours", 
          action: handleSubscribeToCourse,
          disabled: loading
        },
        secondaryButton: { 
          text: "Annuler", 
          action: () => setIsModalOpen(false),
          disabled: loading
        }
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
                  <div className="hero-content">
                    <div className="hero-buttons">
                      <Link to="/register" className="cta-button primary">
                        <span className="button-text">Rejoignez-nous !</span>
                        <span className="button-icon">🎓</span>
                      </Link>
                      <Link to="/cours" className="cta-button secondary">
                        <span className="button-text">Découvrir les cours</span>
                        <span className="button-icon">📚</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Section Cours */}
      <section className="courses-section" id="courses">
        <h2>Nos Cours</h2>
        
        {user && user.role === 'etudiant' && userSubscriptions.length > 0 && (
          <div className="mes-cours-link">
            <Link to="/mes-cours" className="btn-mes-cours">
              📚 Voir mes cours ({userSubscriptions.length})
            </Link>
          </div>
        )}

        <div className="courses-container">
          <Slider {...sliderSettingsCourses}>
            {courses.map((course) => {
              const isUserStudent = user && user.role === 'etudiant';
              const isUserSubscribed = isUserStudent && userSubscriptions.some(sub => sub.idCours === course.idCours);
              
              return (
                <div 
                  className="course-card" 
                  key={course.idCours}
                  onClick={() => handleCourseClick(course)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="course-image">
                    {course.image ? (
                      <img src={course.image} alt={course.titre} />
                    ) : (
                      <div className="course-image-placeholder">
                        <span className="placeholder-icon">📚</span>
                      </div>
                    )}
                  </div>
                  <div className="course-content">
                    <h3>{course.titre}</h3>
                    <p className="course-description">{course.description}</p>
                    <p className="course-class"><strong>Classe :</strong> {course.nomClasse}</p>
                    
                    {!user && (
                      <div className="course-status not-logged-in">
                        🔒 Connectez-vous pour accéder
                      </div>
                    )}
                    {user && user.role !== 'etudiant' && (
                      <div className="course-status not-student">
                        👨‍🏫 Réservé aux étudiants
                      </div>
                    )}
                    {isUserStudent && isUserSubscribed && (
                      <div className="course-status subscribed">
                        ✅ Vous êtes inscrit à ce cours
                      </div>
                    )}
                    {isUserStudent && !isUserSubscribed && (
                      <div className="course-status not-subscribed">
                        📝 Inscription requise
                      </div>
                    )}
                    
                    <div className="course-actions" onClick={(e) => e.stopPropagation()}>
                      {!user && (
                        <button 
                          className="btn-primary"
                          onClick={() => handleCourseClick(course)}
                        >
                          Voir le cours
                        </button>
                      )}
                      
                      {user && user.role !== 'etudiant' && (
                        <button 
                          className="btn-secondary"
                          onClick={() => handleCourseClick(course)}
                        >
                          Voir les détails
                        </button>
                      )}
                      
                      {isUserStudent && isUserSubscribed && (
                        <button 
                          className="btn-success"
                          onClick={(e) => handleViewCourse(course.idCours, e)}
                        >
                          Accéder au cours
                        </button>
                      )}
                      
                      {isUserStudent && !isUserSubscribed && (
                        <button 
                          className="btn-secondary"
                          onClick={() => handleCourseClick(course)}
                        >
                          S'inscrire au cours
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>

      {/* Section Professeurs */}
      <section className="teachers-section" id="teachers">
        <h2>Nos Enseignants</h2>
        
        {teachersLoading ? (
          <div className="teachers-loading">
            <div className="loading-spinner"></div>
            <p>Chargement de nos enseignants...</p>
          </div>
        ) : (
          <div className="teachers-container">
            <Slider {...sliderSettingsTeachers}>
              {teachers.map((teacher, index) => (
                <div className="teacher-card" key={teacher.id || index}>
                  <div className="teacher-image">
                    <img 
                      src={teacher.img} 
                      alt={`${teacher.prenom} ${teacher.nom}`}
                      onError={(e) => {
                        e.target.src = defaultTeacherImages[index % defaultTeacherImages.length];
                      }}
                    />
                  </div>
                  <h3>{teacher.prenom} {teacher.nom}</h3>
                  <p className="teacher-subject">{teacher.subject || "Enseignant"}</p>
                  {teacher.nombreCours > 0 && (
                    <div className="teacher-stats">
                      <span className="course-count">{teacher.nombreCours} cours</span>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        )}
        
        {!teachersLoading && teachers.length === 0 && (
          <div className="no-teachers">
            <p>Aucun enseignant disponible pour le moment.</p>
          </div>
        )}
      </section>

      {/* Modal dynamique */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => !loading && setIsModalOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <h2>{modalContent.title}</h2>
          <p>{modalContent.message}</p>
          <div className="modal-buttons">
            <button 
              onClick={modalContent.primaryButton.action} 
              className="btn-primary"
              disabled={modalContent.primaryButton.disabled}
            >
              {modalContent.primaryButton.text}
            </button>
            <button 
              onClick={modalContent.secondaryButton.action} 
              className="btn-secondary"
              disabled={modalContent.secondaryButton.disabled}
            >
              {modalContent.secondaryButton.text}
            </button>
          </div>
        </div>
      </Modal>

<style jsx>{`
        .course-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 10px;
          background: white;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .course-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .course-status {
          padding: 8px 12px;
          border-radius: 4px;
          margin: 10px 0;
          font-size: 14px;
          font-weight: 500;
        }

        .course-status.not-logged-in {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }

        .course-status.not-student {
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        .course-status.subscribed {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .course-status.not-subscribed {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .course-actions {
          margin-top: 15px;
        }

        .btn-primary, .btn-secondary, .btn-success {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
          width: 100%;
          margin-bottom: 5px;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #545b62;
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #218838;
        }

        .btn-primary:disabled, .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .custom-modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 500px;
          margin: 100px auto;
          position: relative;
        }

        .custom-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-buttons button {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

export default Home;
