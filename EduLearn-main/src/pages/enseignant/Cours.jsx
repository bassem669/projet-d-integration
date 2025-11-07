import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBookOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import "./TeacherDashboard.css";

export default function Cours() {
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Mathématiques",
      description: "Cours sur les équations et fonctions.",
      content: "Introduction aux fonctions linéaires et quadratiques...",
      date: "2025-10-01",
      fileName: "cours-math.pdf",
    },
  ]);

  const [activeTab, setActiveTab] = useState("listeCours");
  const [courseSearch, setCourseSearch] = useState("");
  const [newCourse, setNewCourse] = useState({
    id: null,
    title: "",
    description: "",
    content: "",
    date: "",
    file: null,
    fileName: "",
  });

  //  Notifications
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  // Ajouter un cours
  const handleCourseSubmit = (e) => {
    e.preventDefault();

    if (!newCourse.title || !newCourse.description || !newCourse.content || !newCourse.date) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    if (newCourse.file) {
      const allowedTypes = ["application/pdf", "video/mp4", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(newCourse.file.type)) {
        showNotification("error", "Format de fichier non supporté !");
        return;
      }
      if (newCourse.file.size > 5 * 1024 * 1024) {
        showNotification("error", "Le fichier est trop volumineux (max 5 Mo) !");
        return;
      }
    }

    const newCourseObj = {
      ...newCourse,
      id: courses.length + 1,
      fileName: newCourse.file ? newCourse.file.name : "",
    };

    setCourses([...courses, newCourseObj]);
    showNotification("success", "Cours ajouté avec succès !");
    resetForm();
    setActiveTab("listeCours");
  };

  // Modifier un cours
  const handleEditCourse = (course) => {
    setNewCourse(course);
    setActiveTab("modifierCours");
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();

    if (!newCourse.title || !newCourse.description || !newCourse.content || !newCourse.date) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    const updatedCourses = courses.map((c) =>
      c.id === newCourse.id
        ? { ...newCourse, fileName: newCourse.file ? newCourse.file.name : c.fileName }
        : c
    );

    setCourses(updatedCourses);
    showNotification("success", "Cours modifié avec succès !");
    resetForm();
    setActiveTab("listeCours");
  };

  // Supprimer un cours
  const handleDeleteCourse = (id, title) => {
    if (window.confirm(`Supprimer le cours "${title}" ?`)) {
      setCourses(courses.filter((c) => c.id !== id));
      showNotification("success", "Cours supprimé avec succès !");
    }
  };

  const resetForm = () => {
    setNewCourse({
      id: null,
      title: "",
      description: "",
      content: "",
      date: "",
      file: null,
      fileName: "",
    });
  };

  // Filtrage
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="cours-container p-4">
      {/* Notification */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
            </div>
            <div className="notification-message">{notification.message}</div>
            <button
              className="notification-close"
              onClick={() => setNotification({ show: false, type: "", message: "" })}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Liste des cours */}
      {activeTab === "listeCours" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h3>
              <FaBookOpen className="me-2 text-primary" /> Gestion des cours
            </h3>
            <button
              className="btn"
              style={{ backgroundColor: "#ff8800", color: "#fff" }}
              onClick={() => setActiveTab("ajouterCours")}
            >
              <FaPlus /> Ajouter un cours
            </button>
          </div>

          {/* Recherche */}
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
          </div>

          {/* Tableau */}
          <div className="table-responsive">
            <table className="table table-modern align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Fichier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.description}</td>
                      <td>{c.date}</td>
                      <td>{c.fileName || "—"}</td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditCourse(c)}>
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#ff8800", color: "#fff" }}
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      Aucun cours trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Formulaire création / modification */}
        {(activeTab === "ajouterCours" || activeTab === "modifierCours") && (
        <div className="card-modern p-4 mt-4">
            <h4>{activeTab === "modifierCours" ? "Modifier le cours" : "Créer un nouveau cours"}</h4>
            <form onSubmit={activeTab === "modifierCours" ? handleUpdateCourse : handleCourseSubmit}>

            {/* Titre */}
            <div className="row mb-3 align-items-center">
                <label className="col-sm-2 col-form-label">Titre *</label>
                <div className="col-sm-10">
                <input
                    type="text"
                    className="form-control"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                />
                </div>
            </div>

            {/* Description */}
            <div className="row mb-3 align-items-center">
                <label className="col-sm-2 col-form-label">Description *</label>
                <div className="col-sm-10">
                <textarea
                    className="form-control"
                    rows="3"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    required
                ></textarea>
                </div>
            </div>

            {/* Contenu */}
            <div className="row mb-3 align-items-center">
                <label className="col-sm-2 col-form-label">Contenu *</label>
                <div className="col-sm-10">
                <textarea
                    className="form-control"
                    rows="4"
                    value={newCourse.content}
                    onChange={(e) => setNewCourse({ ...newCourse, content: e.target.value })}
                    required
                ></textarea>
                </div>
            </div>

            {/* Date */}
            <div className="row mb-3 align-items-center">
                <label className="col-sm-2 col-form-label">Date *</label>
                <div className="col-sm-10">
                <input
                    type="date"
                    className="form-control"
                    value={newCourse.date}
                    onChange={(e) => setNewCourse({ ...newCourse, date: e.target.value })}
                    required
                />
                </div>
            </div>

            {/* Fichier */}
            <div className="row mb-3 align-items-center">
                <label className="col-sm-2 col-form-label">Fichier</label>
                <div className="col-sm-10">
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setNewCourse({ ...newCourse, file: e.target.files[0] })}
                />
                <small className="text-muted">
                    Formats acceptés : PDF, MP4, PNG, JPG (max 5 Mo)
                </small>
                </div>
            </div>

            {/* Boutons */}
            <div className="d-flex justify-content-between mt-4">
                <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#ff8800", color: "#fff" }}
                onClick={() => {
                    resetForm();
                    setActiveTab("listeCours");
                }}
                >
                ← Retour
                </button>
                <button type="submit" className="btn btn-primary">
                {activeTab === "modifierCours" ? "Mettre à jour" : "Publier le cours"}
                </button>
            </div>
            </form>
        </div>
        )}

    </div>
  );
}
