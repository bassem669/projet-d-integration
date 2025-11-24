import React, { useState, useEffect } from "react";
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
  FaLink,
  FaFilePdf,
  FaVideo,
  FaImage,
} from "react-icons/fa";
import { courseService } from '../../services/courseService';
import { resourceService } from '../../services/resourceService';
import "./TeacherDashboard.css";

export default function Cours() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState({});
  const [pendingResources, setPendingResources] = useState([]);

  const [activeTab, setActiveTab] = useState("listeCours");
  const [courseSearch, setCourseSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    id: null,
    titre: "",
    description: "",
    content: "",
    DateCours: "",
    file: null,
    fileName: "",
  });

  const [newResource, setNewResource] = useState({
    type: "pdf",
    url: ""
  });

  useEffect(() => {
    if (user && user.idUtilisateur) {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getCoursByEnseignant(user.idUtilisateur);
      setCourses(coursesData);
    } catch (error) {
      console.error('Erreur fetchCourses:', error);
      showNotification("error", "Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async (courseId) => {
    try {
      const resourcesData = await resourceService.getResourcesByCourse(courseId);
      setResources(prev => ({ ...prev, [courseId]: resourcesData }));
    } catch (error) {
      console.error('Erreur fetchResources:', error);
      showNotification("error", "Erreur lors du chargement des ressources");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleEditCourse = async (course) => { 
    setNewCourse(course); 
    setActiveTab("modifierCours"); 
    await fetchResources(course.id);
  };

  const handleAddPendingResource = () => {
    if (!newResource.url.trim()) {
      showNotification("error", "Veuillez saisir l'URL de la ressource");
      return;
    }
    const resource = {
      id: Date.now(),
      type: newResource.type,
      url: newResource.url
    };
    setPendingResources([...pendingResources, resource]);
    setNewResource({ type: "pdf", url: "" });
    showNotification("success", "Ressource ajoutée à la liste !");
  };

  const handleRemovePendingResource = (resourceId) => {
    setPendingResources(pendingResources.filter(r => r.id !== resourceId));
    showNotification("success", "Ressource retirée de la liste !");
  };

  const handleAddResource = async (courseId) => {
    if (!newResource.url.trim()) {
      showNotification("error", "Veuillez saisir l'URL de la ressource");
      return;
    }
    try {
      await resourceService.addResource({
        courseId: courseId,
        type: newResource.type,
        url: newResource.url
      });
      showNotification("success", "Ressource ajoutée avec succès !");
      setNewResource({ type: "pdf", url: "" });
      await fetchResources(courseId);
    } catch (error) {
      console.error(error);
      showNotification("error", error.message);
    }
  };

  const handleDeleteResource = async (resourceId, courseId) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    try {
      await resourceService.deleteResource(resourceId);
      showNotification("success", "Ressource supprimée avec succès !");
      await fetchResources(courseId);
    } catch (error) {
      console.error(error);
      showNotification("error", error.message);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!newCourse.titre || !newCourse.description || !newCourse.DateCours) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }
    try {
      const courseData = {
        titre: newCourse.titre,
        description: newCourse.description,
        DateCours: newCourse.DateCours,
        idUtilisateur: user.idUtilisateur
      };
      const createdCourse = await courseService.createCourse(courseData);
      const courseId = createdCourse.idCours || createdCourse.insertId;

      if (pendingResources.length > 0) {
        const resourcePromises = pendingResources.map(resource =>
          resourceService.addResource({
            courseId: courseId,
            type: resource.type,
            url: resource.url
          })
        );
        await Promise.all(resourcePromises);
      }
      await fetchCourses();
      showNotification("success", `Cours ajouté avec succès ! ${pendingResources.length > 0 ? `Et ${pendingResources.length} ressource(s) ajoutée(s).` : ''}`);
      resetForm();
      setActiveTab("listeCours");
    } catch (error) {
      console.error("Erreur:", error.message);
      showNotification("error", error.message || "Erreur réseau ou serveur !");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.titre || !newCourse.description || !newCourse.DateCours) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }
    try {
      const updatedData = {
        titre: newCourse.titre,
        description: newCourse.description,
        DateCours: newCourse.DateCours,
        idUtilisateur: user.idUtilisateur
      };
      await courseService.updateCourse(newCourse.id, updatedData);
      await fetchCourses();
      showNotification("success", "Cours modifié avec succès !");
      resetForm();
      setActiveTab("listeCours");
    } catch (error) {
      console.error("Erreur:", error.message);
      showNotification("error", error.message || "Erreur réseau ou serveur !");
    }
  };

  const handleDeleteCourse = async (id, titre) => {
    if (!window.confirm(`Supprimer le cours "${titre}" ?`)) return;
    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
      showNotification("success", "Cours supprimé avec succès !");
    } catch (error) {
      console.error("Erreur:", error.message);
      showNotification("error", error.message || "Erreur réseau ou serveur !");
    }
  };

  const resetForm = () => {
    setNewCourse({
      id: null,
      titre: "",
      description: "",
      content: "",
      DateCours: "",
      file: null,
      fileName: "",
    });
    setNewResource({ type: "pdf", url: "" });
    setPendingResources([]);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-danger" />;
      case 'video': return <FaVideo className="text-primary" />;
      case 'image': return <FaImage className="text-success" />;
      default: return <FaLink className="text-warning" />;
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.titre && course.titre.toLowerCase().includes(courseSearch.toLowerCase())
  );

  if (loading) return <p>Chargement des cours...</p>;

  return (
    <div className="cours-container p-4">
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

      {activeTab === "listeCours" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h3>
              <FaBookOpen className="me-2 text-primary" /> Mes cours
            </h3>
            <button
              className="btn"
              style={{ backgroundColor: "#ff8800", color: "#fff" }}
              onClick={() => setActiveTab("ajouterCours")}
            >
              <FaPlus /> Ajouter un cours
            </button>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
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

          <div className="table-responsive">
            <table className="table table-modern align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Classe</th>
                  <th>Ressources</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((c) => (
                    <tr key={c.idCours || c.id}>
                      <td>{c.titre}</td>
                      <td>{c.description}</td>
                      <td>{c.DateCours ? new Date(c.DateCours).toLocaleDateString('fr-FR') : ''}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {c.nomClasse || 'Non assigné'}
                        </span>
                      </td>
                      <td>
                        {resources[c.idCours || c.id] && resources[c.idCours || c.id].length > 0 ? (
                          <span className="badge bg-primary">
                            {resources[c.idCours || c.id].length} ressource(s)
                          </span>
                        ) : (
                          <span className="text-muted">Aucune ressource</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm me-2" 
                          onClick={() => handleEditCourse({
                            id: c.idCours || c.id,
                            titre: c.titre,
                            description: c.description,
                            DateCours: c.DateCours
                          })}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#ff8800", color: "#fff" }}
                          onClick={() => handleDeleteCourse(c.idCours || c.id, c.titre)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      {courses.length === 0 
                        ? "Aucun cours créé pour le moment" 
                        : "Aucun cours trouvé avec ce critère de recherche"
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(activeTab === "ajouterCours" || activeTab === "modifierCours") && (
        <div className="card-modern p-4 mt-4">
          <h4>{activeTab === "modifierCours" ? "Modifier le cours" : "Créer un nouveau cours"}</h4>
          <form onSubmit={activeTab === "modifierCours" ? handleUpdateCourse : handleCourseSubmit}>
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Titre *</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={newCourse.titre}
                  onChange={(e) => setNewCourse({ ...newCourse, titre: e.target.value })}
                  required
                />
              </div>
            </div>

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

            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Date *</label>
              <div className="col-sm-10">
                <input
                  type="date"
                  className="form-control"
                  value={newCourse.DateCours ? newCourse.DateCours.split('T')[0] : ""}
                  onChange={(e) => setNewCourse({ ...newCourse, DateCours: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Gestion des ressources */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-3">
                    <FaLink className="me-2" />
                    {activeTab === "ajouterCours" ? "Ajouter des ressources au cours" : "Gestion des ressources du cours"}
                  </h6>
                  <div className="row g-2 mb-3">
                    <div className="col-md-3">
                      <select
                        className="form-control"
                        value={newResource.type}
                        onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                      >
                        <option value="pdf">PDF</option>
                        <option value="video">Vidéo</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="URL de la ressource..."
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={activeTab === "ajouterCours" ? handleAddPendingResource : () => handleAddResource(newCourse.id)}
                      >
                        <FaPlus /> Ajouter
                      </button>
                    </div>
                  </div>

                  {activeTab === "ajouterCours" ? (
                    pendingResources.length > 0 ? (
                      <div className="mt-3">
                        <small className="text-muted d-block mb-2">Ressources à ajouter :</small>
                        {pendingResources.map((resource) => (
                          <div key={resource.id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white">
                            <div className="d-flex align-items-center">
                              {getResourceIcon(resource.type)}
                              <span className="ms-2">
                                <strong>{resource.type.toUpperCase()}:</strong> {resource.url}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemovePendingResource(resource.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3">Aucune ressource ajoutée pour le moment</div>
                    )
                  ) : (
                    resources[newCourse.id] && resources[newCourse.id].length > 0 ? (
                      <div className="mt-3">
                        <small className="text-muted d-block mb-2">Ressources existantes :</small>
                        {resources[newCourse.id].map((resource) => (
                          <div key={resource.id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white">
                            <div className="d-flex align-items-center">
                              {getResourceIcon(resource.type)}
                              <span className="ms-2">
                                <strong>{resource.type.toUpperCase()}:</strong> {resource.url}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteResource(resource.id, newCourse.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3">Aucune ressource ajoutée pour ce cours</div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#ff8800", color: "#fff" }}
                onClick={() => { resetForm(); setActiveTab("listeCours"); }}
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
