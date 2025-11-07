import React, { useState } from "react"; 
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaEnvelopeOpenText,
  FaUserCircle,
  FaBookOpen,
  FaListAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from "recharts";

import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("accueil");
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [teacher, setTeacher] = useState({
    name: "Karim",
    surname: "Karim",
    email: "karim@example.com",
    createdCourses: 2,
    students: 77,
    unreadMessages: 3,
  });

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Mathématiques",
      students: 35,
      date: "2025-10-01",
      type: "PDF",
      progress: 70,
    },
    {
      id: 2,
      title: "Programmation",
      students: 42,
      date: "2025-10-05",
      type: "PowerPoint",
      progress: 40,
    },
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: "Alice Dupont", email: "alice@mail.com", progress: 90 },
    { id: 2, name: "Bob Martin", email: "bob@mail.com", progress: 65 },
    { id: 3, name: "Claire Bernard", email: "claire@mail.com", progress: 80 },
  ]);

  const [results, setResults] = useState([
    { id: 1, student: "Alice Dupont", course: "Mathématiques", grade: 18 },
    { id: 2, student: "Bob Martin", course: "Programmation", grade: 15 },
    { id: 3, student: "Claire Bernard", course: "Mathématiques", grade: 16 },
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    date: "",
    level: "",
    file: null
  });

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    progress: 0
  });

  // États pour le filtrage et la recherche
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  
  const [studentSearch, setStudentSearch] = useState("");
  const [studentProgressFilter, setStudentProgressFilter] = useState("all");
  
  const [resultSearch, setResultSearch] = useState("");
  const [resultCourseFilter, setResultCourseFilter] = useState("all");
  const [resultGradeFilter, setResultGradeFilter] = useState("all");

  // Fonction pour afficher les notifications
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    try {
      if (!newCourse.title || !newCourse.date || !newCourse.level) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      const newCourseObj = {
        ...newCourse,
        id: courses.length + 1,
        students: 0,
        progress: 0,
        type: newCourse.type || "PDF"
      };

      setCourses([...courses, newCourseObj]);
      setNewCourse({ title: "", date: "", level: "", file: null });
      setActiveTab("mesCours");
      showNotification("success", "Cours créé avec succès !");
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    try {
      if (!newStudent.name || !newStudent.email) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      const newStudentObj = {
        ...newStudent,
        id: students.length + 1,
        progress: newStudent.progress || 0
      };

      setStudents([...students, newStudentObj]);
      setNewStudent({ name: "", email: "", progress: 0 });
      setActiveTab("etudiants");
      showNotification("success", "Étudiant ajouté avec succès !");
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    try {
      if (teacher.password && teacher.password !== teacher.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
      showNotification("success", "Profil mis à jour avec succès !");
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const handleDeleteCourse = (courseId, courseTitle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${courseTitle}" ?`)) {
      setCourses(courses.filter(course => course.id !== courseId));
      showNotification("success", "Cours supprimé avec succès !");
    }
  };

  const handleDeleteStudent = (studentId, studentName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant "${studentName}" ?`)) {
      setStudents(students.filter(student => student.id !== studentId));
      showNotification("success", "Étudiant supprimé avec succès !");
    }
  };

  const handleDeleteResult = (resultId, studentName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le résultat de "${studentName}" ?`)) {
      setResults(results.filter(result => result.id !== resultId));
      showNotification("success", "Résultat supprimé avec succès !");
    }
  };

  // Fonctions de filtrage et recherche pour les cours
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesFilter = courseFilter === "all" || course.type === courseFilter;
    return matchesSearch && matchesFilter;
  });

  // Fonctions de filtrage et recherche pour les étudiants
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                         student.email.toLowerCase().includes(studentSearch.toLowerCase());
    
    let matchesProgress = true;
    if (studentProgressFilter === "high") {
      matchesProgress = student.progress >= 80;
    } else if (studentProgressFilter === "medium") {
      matchesProgress = student.progress >= 50 && student.progress < 80;
    } else if (studentProgressFilter === "low") {
      matchesProgress = student.progress < 50;
    }
    
    return matchesSearch && matchesProgress;
  });

  // Fonctions de filtrage et recherche pour les résultats
  const filteredResults = results.filter(result => {
    const matchesSearch = result.student.toLowerCase().includes(resultSearch.toLowerCase()) || 
                         result.course.toLowerCase().includes(resultSearch.toLowerCase());
    
    const matchesCourse = resultCourseFilter === "all" || result.course === resultCourseFilter;
    
    let matchesGrade = true;
    if (resultGradeFilter === "excellent") {
      matchesGrade = result.grade >= 16;
    } else if (resultGradeFilter === "good") {
      matchesGrade = result.grade >= 12 && result.grade < 16;
    } else if (resultGradeFilter === "average") {
      matchesGrade = result.grade < 12;
    }
    
    return matchesSearch && matchesCourse && matchesGrade;
  });

  return (
    <div className="dashboard">
      {/* Notification System */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotification({ show: false, type: '', message: '' })}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "250px",
            height: "180px",
            objectFit: "contain",
            marginBottom: "10px",
          }}
        />
        
        <ul className="list-unstyled flex-grow-1">
          <li
            className={`sidebar-item ${activeTab === "accueil" ? "active" : ""}`}
            onClick={() => setActiveTab("accueil")}
          >
            <FaChalkboardTeacher /> Accueil
          </li>

          <li
            className={`sidebar-item ${activeTab === "mesCours" ? "active" : ""}`}
            onClick={() => setActiveTab("mesCours")}
          >
            <FaBookOpen /> Mes cours
          </li>

          <li
            className={`sidebar-item ${activeTab === "etudiants" ? "active" : ""}`}
            onClick={() => setActiveTab("etudiants")}
          >
            <FaUserGraduate /> Étudiants
          </li>

          <li
            className={`sidebar-item ${activeTab === "resultats" ? "active" : ""}`}
            onClick={() => setActiveTab("resultats")}
          >
            <FaListAlt /> Résultats
          </li>

          <li
            className={`sidebar-item ${activeTab === "profil" ? "active" : ""}`}
            onClick={() => setActiveTab("profil")}
          >
            <FaUserCircle /> Profil
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="content">
      {activeTab === "accueil" && (
        <>
          <h3>
            Bonjour, <span className="text-primary">{teacher.name}</span> 👋
          </h3>

          {/* Statistiques principales */}
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="card-modern text-center p-3">
                <FaChalkboardTeacher size={40} className="mb-2 text-primary" />
                <h6>Cours créés</h6>
                <h3>{teacher.createdCourses}</h3>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="card-modern text-center p-3">
                <FaUserGraduate size={40} className="mb-2 text-success" />
                <h6>Étudiants</h6>
                <h3>{teacher.students}</h3>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="card-modern text-center p-3">
                <FaEnvelopeOpenText size={40} className="mb-2 text-danger" />
                <h6>Messages non lus</h6>
                <h3>{teacher.unreadMessages}</h3>
              </div>
            </div>

            <div className="col-sm-6 col-md-3">
              <div className="card-modern text-center p-3">
                <FaListAlt size={40} className="mb-2 text-warning" />
                <h6>Progression moyenne</h6>
                <h3>
                  {students.length
                    ? Math.round(
                        students.reduce((acc, s) => acc + s.progress, 0) / students.length
                      )
                    : 0}
                  %
                </h3>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div className="mb-4">
            <h4>Progression des cours</h4>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courses} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#1e3a8a" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cours récents */}
          <h4 className="mb-3">Cours récents</h4>
          <div className="row g-3 mb-4">
            {courses.slice(0, 3).map((c) => (
              <div key={c.id} className="col-sm-12 col-md-4">
                <div className="card-modern p-3 h-100 d-flex flex-column justify-content-between">
                  <h5>{c.title}</h5>
                  <p>Date: {c.date}</p>
                  <p>Étudiants inscrits: {c.students}</p>
                  <div className="progress-modern mb-2">
                    <div className="progress-bar" style={{ width: `${c.progress}%` }}></div>
                  </div>
                  <span>Progression: {c.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
        {/* Mes cours avec recherche et filtrage */}
        {activeTab === "mesCours" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h4 className="mb-2">Mes cours</h4>
            <button
              className="btn mb-2"
              style={{ backgroundColor: "#ff8800", color: "#fff" }}
              onClick={() => setActiveTab("creerCours")}
            >
              <FaPlus /> Créer un cours
            </button>
          </div>

          {/* Barre de recherche et filtres pour les cours */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un cours..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="PDF">PDF</option>
                <option value="PowerPoint">PowerPoint</option>
                <option value="Video">Vidéo</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-modern align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Étudiants</th>
                  <th>Progression</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.date}</td>
                      <td>{c.type}</td>
                      <td>{c.students}</td>
                      <td>
                        <div className="progress-modern mb-1">
                          <div
                            className="progress-bar"
                            style={{ width: `${c.progress || 0}%` }}
                          ></div>
                        </div>
                        <small>{c.progress || 0}%</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => showNotification("info", `Modification du cours "${c.title}" - Fonctionnalité à implémenter`)}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#ff8800", color: "#fff" }}
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Aucun cours trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "creerCours" && (
        <div className="card-modern p-4 mt-4">
          <h4>Créer un cours</h4>
          <form className="form-horizontal" onSubmit={handleCourseSubmit}>
            <div className="form-group mb-3">
              <label>Titre *</label>
              <input
                type="text"
                className="form-control"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Date *</label>
              <input
                type="date"
                className="form-control"
                value={newCourse.date}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Niveau *</label>
              <select
                className="form-control"
                value={newCourse.level}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, level: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Sélectionnez le niveau
                </option>
                <option value="première">Première</option>
                <option value="deuxième">Deuxième</option>
                <option value="troisième">Troisième</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Type de fichier *</label>
              <select
                className="form-control"
                value={newCourse.type || "PDF"}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, type: e.target.value })
                }
                required
              >
                <option value="PDF">PDF</option>
                <option value="PowerPoint">PowerPoint</option>
                <option value="Video">Vidéo</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Fichier</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setNewCourse({ ...newCourse, file: e.target.files[0] })
                }
              />
            </div>

            {/* Conteneur pour les boutons */}
            <div className="form-group d-flex justify-content-between">
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#ff8800", color: "#fff" }}
                onClick={() => setActiveTab("mesCours")}
              >
                ← Retour
              </button>

              <button type="submit" className="btn btn-primary">
                Créer le cours
              </button>
            </div>
          </form>
        </div>
      )}

        {/* Étudiants avec recherche et filtrage */}
        {activeTab === "etudiants" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h4 className="mb-2">Liste des étudiants</h4>
              <button
                className="btn"
                style={{ backgroundColor: "#ff8800", color: "#fff" }}
                onClick={() => setActiveTab("ajouterEtudiant")}
              >
                <FaPlus /> Ajouter un étudiant
              </button>
            </div>

            {/* Barre de recherche et filtres pour les étudiants */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un étudiant..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={studentProgressFilter}
                  onChange={(e) => setStudentProgressFilter(e.target.value)}
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="high">Progression élevée (≥80%)</option>
                  <option value="medium">Progression moyenne (50-79%)</option>
                  <option value="low">Progression faible (&lt;50%)</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-modern align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Progression</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>
                          <div className="progress-modern mb-1">
                            <div
                              className="progress-bar"
                              style={{ width: `${s.progress}%` }}
                            ></div>
                          </div>
                          <small>{s.progress}%</small>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => showNotification("info", `Modification de l'étudiant "${s.name}" - Fonctionnalité à implémenter`)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ backgroundColor: "#ff8800", color: "#fff" }}
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        Aucun étudiant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ajouterEtudiant" && (
          <div className="card-modern p-4 mt-4">
            <h4>Ajouter un étudiant</h4>
            <form className="form-horizontal" onSubmit={handleStudentSubmit}>
              <div className="form-group mb-3">
                <label>Nom complet *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Progression initiale (%)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={newStudent.progress}
                  onChange={(e) => setNewStudent({ ...newStudent, progress: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group d-flex justify-content-between">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#ff8800", color: "#fff" }}
                  onClick={() => setActiveTab("etudiants")}
                >
                  ← Retour
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajouter l'étudiant
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Résultats avec recherche et filtrage */}
        {activeTab === "resultats" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h4 className="mb-2">Résultats des examens</h4>
            </div>

            {/* Barre de recherche et filtres pour les résultats */}
            <div className="row mb-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher étudiant ou cours..."
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={resultCourseFilter}
                  onChange={(e) => setResultCourseFilter(e.target.value)}
                >
                  <option value="all">Tous les cours</option>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Programmation">Programmation</option>
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={resultGradeFilter}
                  onChange={(e) => setResultGradeFilter(e.target.value)}
                >
                  <option value="all">Toutes les notes</option>
                  <option value="excellent">Excellent (≥16)</option>
                  <option value="good">Bon (12-15)</option>
                  <option value="average">Moyen (&lt;12)</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-modern align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Étudiant</th>
                    <th>Cours</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((r) => (
                      <tr key={r.id}>
                        <td>{r.student}</td>
                        <td>{r.course}</td>
                        <td>
                          <span className={`badge ${
                            r.grade >= 16 ? "bg-success" : 
                            r.grade >= 12 ? "bg-warning" : "bg-danger"
                          }`}>
                            {r.grade}/20
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => showNotification("info", `Modification de la note de "${r.student}" - Fonctionnalité à implémenter`)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ backgroundColor: "#ff8800", color: "#fff" }}
                            onClick={() => handleDeleteResult(r.id, r.student)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        Aucun résultat trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profil */}
        {activeTab === "profil" && (
          <div className="card-modern p-4 mt-4">
            <div className="row">
              {/* Colonne gauche : photo de profil */}
              <div className="col-md-4 text-center mb-4">
                <div
                  style={{
                    width: "250px",
                    height: "300px",
                    margin: "0 auto",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "4px solid #ff8800",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={teacher.profilePicture || "https://via.placeholder.com/250x300"}
                    alt="Profil"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="btn mt-3"
                    style={{ backgroundColor: "#ff8800", color: "#fff" }}
                  >
                    Changer la photo
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setTeacher({ ...teacher, profilePicture: reader.result });
                            showNotification("success", "Photo de profil mise à jour !");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Colonne droite : formulaire */}
              <div className="col-md-8">
                <h5>Changer les informations générales</h5>
                <form className="form-horizontal" onSubmit={handleProfileUpdate}>
                  <div className="form-group mb-3">
                    <label>Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      value={teacher.name}
                      onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      value={teacher.surname}
                      onChange={(e) =>
                        setTeacher({ ...teacher, surname: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={teacher.email}
                      onChange={(e) =>
                        setTeacher({ ...teacher, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={teacher.phone || ""}
                      onChange={(e) =>
                        setTeacher({ ...teacher, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Matière enseignée</label>
                    <input
                      type="text"
                      className="form-control"
                      value={teacher.subject || ""}
                      onChange={(e) =>
                        setTeacher({ ...teacher, subject: e.target.value })
                      }
                    />
                  </div>

                  <hr />

                  <h5>Changer le mot de passe</h5>
                  <div className="form-group mb-3">
                    <label>Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={teacher.password || ""}
                      onChange={(e) =>
                        setTeacher({ ...teacher, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label>Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      value={teacher.confirmPassword || ""}
                      onChange={(e) =>
                        setTeacher({ ...teacher, confirmPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}