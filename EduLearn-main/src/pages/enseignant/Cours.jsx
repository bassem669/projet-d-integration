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
import "./TeacherDashboard.css";

export default function Cours() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem('token');
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState({}); // { courseId: [resources] }
  const [pendingResources, setPendingResources] = useState([]); // Ressources en attente pour nouveau cours

  const [activeTab, setActiveTab] = useState("listeCours");
  const [courseSearch, setCourseSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    id: null,
    title: "",
    description: "",
    content: "",
    date: "",
    file: null,
    fileName: "",
  });

  const [newResource, setNewResource] = useState({
    type: "pdf",
    url: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    fetch('http://localhost:5000/api/cours/')
      .then(response => {
        if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
        return response.json();
      })
      .then(data => {
        const mappedCourses = data.map(c => ({
          id: c.idCours,
          title: c.titre,
          description: c.description,
          date: new Date(c.DateCours).toISOString().split('T')[0],
          fileName: c.support || "—",
          teacher: c.nomUtilisateur,
          classe: c.nomClasse
        }));
        setCourses(mappedCourses);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const fetchResources = async (courseId) => {
    try {
      console.log('🔍 Fetching resources for course:', courseId);
      const response = await fetch(`http://localhost:5000/api/resources/${courseId}`, { // ✅ CORRIGÉ
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Resources fetched:', data);
      setResources(prev => ({ ...prev, [courseId]: data }));
    } catch (error) {
      console.error('❌ Error fetching resources:', error);
      showNotification("error", "Erreur lors du chargement des ressources");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleEditCourse = (course) => { 
    setNewCourse(course); 
    setActiveTab("modifierCours"); 
    fetchResources(course.id);
  };

  const handleAddPendingResource = () => {
    if (!newResource.url.trim()) {
      showNotification("error", "Veuillez saisir l'URL de la ressource");
      return;
    }

    const resource = {
      id: Date.now(), // ID temporaire pour les ressources en attente
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
      const response = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseId,
          type: newResource.type,
          url: newResource.url
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'ajout de la ressource");
      }

      showNotification("success", "Ressource ajoutée avec succès !");
      setNewResource({ type: "pdf", url: "" });
      fetchResources(courseId);
    } catch (error) {
      console.error(error);
      showNotification("error", error.message);
    }
  };

  const handleDeleteResource = async (resourceId, courseId) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      showNotification("success", "Ressource supprimée avec succès !");
      fetchResources(courseId);
    } catch (error) {
      console.error(error);
      showNotification("error", error.message);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    if (!newCourse.title || !newCourse.description || !newCourse.date) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      const dataLogin = {
        titre: newCourse.title,
        description: newCourse.description,
        support: "fichier1",
        DateCours: newCourse.date,
        idClasse: 1,
        idUtilisateur: user.idUtilisateur
      };
      
      const response = await fetch("http://localhost:5000/api/cours/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dataLogin),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification("error", data.message || "Erreur lors de l'ajout du cours !");
        return;
      }

      const courseId = data.idCours || courses.length + 1;

      // Ajouter les ressources en attente après la création du cours
      if (pendingResources.length > 0) {
        for (const resource of pendingResources) {
          await fetch("http://localhost:5000/api/resources", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              courseId: courseId,
              type: resource.type,
              url: resource.url
            })
          });
        }
      }

      const newCourseObj = {
        ...newCourse,
        id: courseId,
        fileName: newCourse.file ? newCourse.file.name : "",
      };

      setCourses([...courses, newCourseObj]);
      showNotification("success", `Cours ajouté avec succès ! ${pendingResources.length > 0 ? `Et ${pendingResources.length} ressource(s) ajoutée(s).` : ''}`);
      resetForm();
      setActiveTab("listeCours");
    } catch (error) {
      console.error("Erreur:", error.message);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!newCourse.title || !newCourse.description || !newCourse.date) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      const updatedData = {
        titre: newCourse.title,
        description: newCourse.description,
        support: "fichier",
        DateCours: newCourse.date,
        idClasse: 1,
        idUtilisateur: user.idUtilisateur
      };

      const response = await fetch(`http://localhost:5000/api/cours/${newCourse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification("error", data.message || "Erreur lors de la mise à jour du cours !");
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
    } catch (error) {
      console.error("Erreur:", error.message);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Supprimer le cours "${title}" ?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cours/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors de la suppression du cours !");
        return;
      }

      setCourses(courses.filter((c) => c.id !== id));
      showNotification("success", "Cours supprimé avec succès !");
    } catch (error) {
      console.error("Erreur:", error.message);
      showNotification("error", "Erreur réseau ou serveur !");
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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
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

          <div className="table-responsive">
            <table className="table table-modern align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Ressources</th>
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
                      <td>
                        {resources[c.id] && resources[c.id].length > 0 ? (
                          <span className="badge bg-primary">
                            {resources[c.id].length} ressource(s)
                          </span>
                        ) : (
                          <span className="text-muted">Aucune ressource</span>
                        )}
                      </td>
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
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
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
                  value={newCourse.date}
                  onChange={(e) => setNewCourse({ ...newCourse, date: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Section Gestion des Ressources (disponible dans les deux formulaires) */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-3">
                    <FaLink className="me-2" />
                    {activeTab === "ajouterCours" ? "Ajouter des ressources au cours" : "Gestion des ressources du cours"}
                  </h6>
                  
                  {/* Formulaire d'ajout de ressource */}
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
                        <option value="lien">Lien</option>
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

                  {/* Liste des ressources */}
                  {activeTab === "ajouterCours" ? (
                    // Ressources en attente pour nouveau cours
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
                      <div className="text-center text-muted py-3">
                        Aucune ressource ajoutée pour le moment
                      </div>
                    )
                  ) : (
                    // Ressources existantes pour cours en modification
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
                      <div className="text-center text-muted py-3">
                        Aucune ressource ajoutée pour ce cours
                      </div>
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