import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserGraduate, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "./TeacherDashboard.css";

export default function GestionEtudiants() {
  const [activeTab, setActiveTab] = useState("etudiants");
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Dupont", email: "alice@mail.com", progress: 90 },
    { id: 2, name: "Bob Martin", email: "bob@mail.com", progress: 65 },
    { id: 3, name: "Claire Bernard", email: "claire@mail.com", progress: 80 },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    progress: 0,
  });

  const [studentSearch, setStudentSearch] = useState("");
  const [studentProgressFilter, setStudentProgressFilter] = useState("all");

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return alert("Veuillez remplir tous les champs");

    const newStudentObj = {
      ...newStudent,
      id: students.length + 1,
      progress: newStudent.progress || 0,
    };

    setStudents([...students, newStudentObj]);
    setNewStudent({ name: "", email: "", progress: 0 });
    setActiveTab("etudiants");
  };

  const handleDeleteStudent = (studentId, studentName) => {
    if (window.confirm(`Supprimer l'étudiant "${studentName}" ?`)) {
      setStudents(students.filter((s) => s.id !== studentId));
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase());

    let matchesProgress = true;
    if (studentProgressFilter === "high") matchesProgress = student.progress >= 80;
    else if (studentProgressFilter === "medium")
      matchesProgress = student.progress >= 50 && student.progress < 80;
    else if (studentProgressFilter === "low") matchesProgress = student.progress < 50;

    return matchesSearch && matchesProgress;
  });

  return (
    <div className="content flex-grow-1 px-4">
      {/* Section Étudiants */}
      {activeTab === "etudiants" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h4 className="mb-2">
              <FaUserGraduate /> Liste des étudiants
            </h4>
            <button
              className="btn"
              style={{ backgroundColor: "#ff8800", color: "#fff" }}
              onClick={() => setActiveTab("ajouterEtudiant")}
            >
              <FaPlus /> Ajouter un étudiant
            </button>
          </div>

          {/* Recherche et filtre */}
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

          {/* Tableau étudiants */}
          <div className="table-responsive">
            <table className="table table-modern align-middle ">
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
                          onClick={() =>
                            alert(`Modifier l'étudiant "${s.name}" (à implémenter)`)
                          }
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

      {/* Formulaire ajout étudiant */}
      {activeTab === "ajouterEtudiant" && (
        <div className="card-modern p-4 mt-4">
          <h4>Ajouter un étudiant</h4>
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group mb-3">
              <label>Nom complet *</label>
              <input
                type="text"
                className="form-control"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Email *</label>
              <input
                type="email"
                className="form-control"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
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
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    progress: parseInt(e.target.value) || 0,
                  })
                }
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
    </div>
  );
}
