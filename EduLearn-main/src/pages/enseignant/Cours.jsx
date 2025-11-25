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
  FaFile,
  FaDownload,
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

  const [activeTab, setActiveTab] = useState("listeCours");
  const [courseSearch, setCourseSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    idCours: null,
    titre: "",
    description: "",
    content: "",
    DateCours: "",
  });

  const [newResource, setNewResource] = useState({
    type: "pdf",
    file: null,
    fileName: ""
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user && user.idUtilisateur) {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getCoursByEnseignant(user.idUtilisateur);
      
      // Transformer les données pour correspondre au format attendu
      const transformedCourses = coursesData.map(course => ({
        idCours: course.idCours,
        titre: course.titre,
        description: course.description,
        content: course.content || "",
        DateCours: course.DateCours,
        nomClasse: course.nomClasse || 'Non assigné',
        nomUtilisateur: course.nomUtilisateur,
        resources: course.resources || [] // Les ressources sont déjà incluses depuis le backend
      }));
      
      setCourses(transformedCourses);
      
      // Mettre à jour l'état des ressources
      const resourcesState = {};
      transformedCourses.forEach(course => {
        if (course.resources && course.resources.length > 0) {
          resourcesState[course.idCours] = course.resources;
        }
      });
      setResources(resourcesState);
      
    } catch (error) {
      console.error('Erreur fetchCourses:', error);
      showNotification("error", "Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  const fetchResourcesForCourse = async (courseId) => {
    try {
      const resourcesData = await resourceService.getResourcesByCourse(courseId);
      setResources(prev => ({ 
        ...prev, 
        [courseId]: resourcesData 
      }));
      return resourcesData;
    } catch (error) {
      console.error('Erreur fetchResourcesForCourse:', error);
      showNotification("error", "Erreur lors du chargement des ressources");
      return [];
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleEditCourse = async (course) => { 
    setNewCourse({
      idCours: course.idCours,
      titre: course.titre,
      description: course.description,
      content: course.content,
      DateCours: course.DateCours
    }); 
    setActiveTab("modifierCours"); 
    
    // Charger les ressources si elles ne sont pas déjà chargées
    if (!resources[course.idCours]) {
      await fetchResourcesForCourse(course.idCours);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewResource({
        ...newResource,
        file: file,
        fileName: file.name
      });
    }
  };

 const handleAddResource = async (courseId) => {
  if (!newResource.file) {
    showNotification("error", "Veuillez sélectionner un fichier");
    return;
  }

  try {
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', newResource.file);
    formData.append('courseId', courseId);
    formData.append('type', newResource.type);

    // Upload
    const uploadedResource = await resourceService.addResource(formData);
    // uploadedResource doit contenir la ressource ajoutée renvoyée par le backend
    
    console.log(uploadedResource.data)
    showNotification("success", "Ressource ajoutée avec succès !");

    // Mettre à jour le state local des ressources de façon incrémentale
    setResources(prev => ({
      ...prev,
      [courseId]: prev[courseId] ? [...prev[courseId], uploadedResource.data] : [uploadedResource.data]
    }));

    console.log(resources)
    setNewResource({ type: "pdf", file: null, fileName: "" });
    setUploadProgress(0);

    // Réinitialiser l'input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';

  } catch (error) {
    console.error('Erreur upload:', error);
    showNotification("error", error.message || "Erreur lors de l'upload du fichier");
  }
};


  const handleDeleteResource = async (resourceId, courseId) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    try {
      await resourceService.deleteResource(resourceId);
      showNotification("success", "Ressource supprimée avec succès !");
      
      // Mettre à jour l'état local
      setResources(prev => ({
        ...prev,
        [courseId]: prev[courseId].filter(resource => resource.id !== resourceId)
      }));
    } catch (error) {
      console.error(error);
      showNotification("error", error.message);
    }
  };

  const handleDownloadResource = (resource) => {
    if (resource.filePath) {
      // Construire l'URL de téléchargement
      const downloadUrl = `http://localhost:5000${resource.filePath}`;
      window.open(downloadUrl, '_blank');
    } else if (resource.url) {
      window.open(resource.url, '_blank');
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
        content: newCourse.content,
        DateCours: newCourse.DateCours,
        idUtilisateur: user.idUtilisateur
      };
      
      await courseService.createCourse(courseData);
      await fetchCourses();
      
      showNotification("success", "Cours ajouté avec succès !");
      resetForm();
      setActiveTab("listeCours");
    } catch (error) {
      console.error("Erreur:", error);
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
        content: newCourse.content,
        DateCours: newCourse.DateCours
      };
      await courseService.updateCourse(newCourse.idCours, updatedData);
      await fetchCourses();
      showNotification("success", "Cours modifié avec succès !");
      resetForm();
      setActiveTab("listeCours");
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", error.message || "Erreur réseau ou serveur !");
    }
  };

  const handleDeleteCourse = async (idCours, titre) => {
    if (!window.confirm(`Supprimer le cours "${titre}" ?`)) return;
    try {
      await courseService.deleteCourse(idCours);
      // Mettre à jour l'état local
      setCourses(courses.filter((c) => c.idCours !== idCours));
      setResources(prev => {
        const newResources = { ...prev };
        delete newResources[idCours];
        return newResources;
      });
      showNotification("success", "Cours supprimé avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", error.message || "Erreur réseau ou serveur !");
    }
  };

  const resetForm = () => {
    setNewCourse({
      idCours: null,
      titre: "",
      description: "",
      content: "",
      DateCours: "",
    });
    setNewResource({ type: "pdf", file: null, fileName: "" });
    setUploadProgress(0);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-danger" />;
      case 'video': return <FaVideo className="text-primary" />;
      case 'image': return <FaImage className="text-success" />;
      default: return <FaFile className="text-warning" />;
    }
  };

  const getResourceDisplayName = (resource) => {
    if (resource.filePath) {
      return resource.filePath.split('/').pop() || 'Fichier';
    }
    return resource.url || 'Ressource';
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.titre && course.titre.toLowerCase().includes(courseSearch.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Chargement des cours...</div>;

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
                  filteredCourses.map((course) => (
                    <tr key={course.idCours}>
                      <td>
                        <strong>{course.titre}</strong>
                        {course.content && (
                          <small className="d-block text-muted mt-1">
                            {course.content.substring(0, 100)}...
                          </small>
                        )}
                      </td>
                      <td>{course.description}</td>
                      <td>{course.DateCours ? new Date(course.DateCours).toLocaleDateString('fr-FR') : ''}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {course.nomClasse}
                        </span>
                      </td>
                      <td>
                        {course.resources && course.resources.length > 0 ? (
                          <div>
                            <span className="badge bg-primary me-1">
                              {course.resources.length} ressource(s)
                            </span>
                            <small className="text-muted d-block mt-1">
                              {course.resources.map(r => r.type).join(', ')}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">Aucune ressource</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm me-2" 
                          onClick={() => handleEditCourse(course)}
                          title="Modifier le cours"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#ff8800", color: "#fff" }}
                          onClick={() => handleDeleteCourse(course.idCours, course.titre)}
                          title="Supprimer le cours"
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
          <h4 className="mb-4">
            {activeTab === "modifierCours" ? "Modifier le cours" : "Créer un nouveau cours"}
          </h4>
          <form onSubmit={activeTab === "modifierCours" ? handleUpdateCourse : handleCourseSubmit}>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Titre *</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={newCourse.titre}
                  onChange={(e) => setNewCourse({ ...newCourse, titre: e.target.value })}
                  required
                  placeholder="Titre du cours"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Description *</label>
              <div className="col-sm-10">
                <textarea
                  className="form-control"
                  rows="3"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                  placeholder="Description du cours"
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Contenu détaillé</label>
              <div className="col-sm-10">
                <textarea
                  className="form-control"
                  rows="5"
                  value={newCourse.content}
                  onChange={(e) => setNewCourse({ ...newCourse, content: e.target.value })}
                  placeholder="Contenu détaillé du cours (objectifs, plan, etc.)"
                />
              </div>
            </div>

            <div className="row mb-3">
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

            {/* Gestion des ressources - Uniquement pour la modification */}
            {activeTab === "modifierCours" && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="border rounded p-3 bg-light">
                    <h6 className="mb-3">
                      <FaLink className="me-2" />
                      Gestion des ressources du cours
                    </h6>
                    
                    {/* Ajout de nouvelle ressource */}
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
                          <option value="document">Document</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                        />
                        {newResource.fileName && (
                          <small className="text-muted">
                            Fichier sélectionné: {newResource.fileName}
                          </small>
                        )}
                      </div>
                      <div className="col-md-3">
                        <button
                          type="button"
                          className="btn btn-success w-100"
                          onClick={() => handleAddResource(newCourse.idCours)}
                        >
                          <FaPlus /> Ajouter
                        </button>
                      </div>
                    </div>

                    {/* Liste des ressources existantes */}
                    {resources[newCourse.idCours] && resources[newCourse.idCours].length > 0 ? (
                      <div className="mt-3">
                        <small className="text-muted d-block mb-2">Ressources existantes :</small>
                        {resources[newCourse.idCours].map((resource) => (
                          <div key={resource.id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white">
                            <div className="d-flex align-items-center flex-grow-1">
                              {getResourceIcon(resource.type)}
                              <div className="ms-2 flex-grow-1">
                                <div>
                                  <strong>{resource.type.toUpperCase()}:</strong> {getResourceDisplayName(resource)}
                                </div>
                                {resource.filePath && (
                                  <small className="text-muted">
                                    {resource.filePath}
                                  </small>
                                )}
                              </div>
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm me-2"
                                  onClick={() => handleDownloadResource(resource)}
                                  title="Télécharger"
                                >
                                  <FaDownload />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteResource(resource.id, newCourse.idCours)}
                                  title="Supprimer"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3">Aucune ressource ajoutée à ce cours</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#ff8800", color: "#fff" }}
                onClick={() => { resetForm(); setActiveTab("listeCours"); }}
              >
                ← Retour à la liste
              </button>
              <button type="submit" className="btn btn-primary">
                {activeTab === "modifierCours" ? "Mettre à jour le cours" : "Créer le cours"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}