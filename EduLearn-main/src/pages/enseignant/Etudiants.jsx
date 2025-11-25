import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserGraduate, FaSearch, FaEye, FaBook, FaSpinner } from "react-icons/fa";
import { etudiantService } from '../../services/etudiantService';
import "./TeacherDashboard.css";

export default function GestionEtudiants() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [enseignantName, setEnseignantName] = useState("");

  // Récupérer les étudiants au chargement du composant
  useEffect(() => {
    if (user && user.idUtilisateur) {
      fetchStudents();
    } else {
      setError("Utilisateur non connecté");
      setLoading(false);
    }
  }, []);

  // Filtrer les étudiants quand la recherche change
  useEffect(() => {
    if (students.length > 0) {
      const filtered = students.filter((student) => {
        const searchTerm = studentSearch.toLowerCase();
        return (
          student.nom?.toLowerCase().includes(searchTerm) ||
          student.prenom?.toLowerCase().includes(searchTerm) ||
          student.email?.toLowerCase().includes(searchTerm) ||
          student.telephone?.toString().includes(searchTerm) ||
          student.cours?.some(cours => 
            cours.nomCours?.toLowerCase().includes(searchTerm)
          )
        );
      });
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [studentSearch, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Appel à l'API pour récupérer les étudiants de l'enseignant
      const response = await etudiantService.getEtudiantsByEnseignant(user.idUtilisateur);
      console.log(response);
      // Adapter selon la structure de votre réponse API
      if (response.success && response.etudiants) {
        console.log(response.etudiants);
        setStudents(response.etudiants);
        setEnseignantName(response.enseignant || "");
      } else if (response.message && response.etudiants === undefined) {
        // Cas où aucun étudiant n'est trouvé
        setStudents([]);
        setError(response.message || "Aucun étudiant trouvé");
      } else {
        setStudents([]);
        setError("Format de réponse inattendu");
      }
      
    } catch (err) {
      console.error("Erreur lors de la récupération des étudiants:", err);
      setError(err.message || "Erreur lors du chargement des étudiants");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <div className="content flex-grow-1 px-4">
        <div className="text-center py-5">
          <FaSpinner className="fa-spin text-primary" size="2em" />
          <p className="mt-2">Chargement des étudiants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content flex-grow-1 px-4">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h4 className="mb-1">
              <FaUserGraduate /> Mes étudiants
            </h4>
            {enseignantName && (
              <small className="text-muted">
                Enseignant: {enseignantName}
              </small>
            )}
          </div>
          <div className="text-muted small">
            {students.length} étudiant(s) trouvé(s)
          </div>
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
                placeholder="Rechercher un étudiant, cours ou téléphone..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="alert alert-warning" role="alert">
            <strong>Information:</strong> {error}
          </div>
        )}

        {/* Tableau étudiants */}
        <div className="table-responsive">
          <table className="table table-modern align-middle">
            <thead className="table-primary">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Nombre de cours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.idEtudiant}>
                    <td>{student.nomUtilisateur}</td>
                    <td>{student.prenom}</td>
                    <td>{student.email}</td>
                    <td>{student.telephone || 'Non renseigné'}</td>
                    <td>
                      <span className="badge bg-primary">
                        {student.cours ? student.cours.length : 0} cours
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetails(student)}
                        title="Voir les détails"
                      >
                        <FaEye /> Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    {students.length === 0 
                      ? "Aucun étudiant inscrit à vos cours" 
                      : "Aucun étudiant trouvé avec ce critère de recherche"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Détails de l'étudiant */}
        {showDetails && selectedStudent && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <FaUserGraduate className="me-2" />
                    Détails de {selectedStudent.prenom} {selectedStudent.nom}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={closeDetails}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <strong>Email:</strong> 
                      <div className="mt-1">{selectedStudent.email}</div>
                    </div>
                    <div className="col-md-6">
                      <strong>Téléphone:</strong>
                      <div className="mt-1">{selectedStudent.telephone || 'Non renseigné'}</div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <strong>Enseignant:</strong>
                      <div className="mt-1">{selectedStudent.enseignant || enseignantName}</div>
                    </div>
                  </div>
                  
                  <h6 className="border-bottom pb-2">
                    <FaBook className="me-2" />
                    Cours suivis avec vous:
                  </h6>
                  
                  {selectedStudent.cours && selectedStudent.cours.length > 0 ? (
                    <div className="mt-3">
                      {selectedStudent.cours.map((cours, index) => (
                        <div key={index} className="card mb-2">
                          <div className="card-body py-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong className="d-block">{cours.nomCours}</strong>
                                <small className="text-muted">
                                  ID Cours: {cours.idCours}
                                </small>
                              </div>
                              <span className="badge bg-secondary">
                                Cours #{cours.idCours}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-3">
                      <FaBook className="me-2" />
                      Aucun cours suivi avec vous
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={closeDetails}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}