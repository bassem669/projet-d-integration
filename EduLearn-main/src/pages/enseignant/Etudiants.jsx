import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserGraduate, FaSearch } from "react-icons/fa";
import "./TeacherDashboard.css";

export default function GestionEtudiants() {
  const [students] = useState([
    { id: 1, name: "Alice Dupont", email: "alice@mail.com", result: "Excellent" },
    { id: 2, name: "Bob Martin", email: "bob@mail.com", result: "Bon" },
    { id: 3, name: "Claire Bernard", email: "claire@mail.com", result: "Très bon" },
  ]);

  const [studentSearch, setStudentSearch] = useState("");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.result.toLowerCase().includes(studentSearch.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="content flex-grow-1 px-4">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h4 className="mb-2">
            <FaUserGraduate /> Liste des étudiants
          </h4>
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
                placeholder="Rechercher un étudiant..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tableau étudiants */}
        <div className="table-responsive">
          <table className="table table-modern align-middle">
            <thead className="table-primary">
              <tr>
                <th>Nom</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}