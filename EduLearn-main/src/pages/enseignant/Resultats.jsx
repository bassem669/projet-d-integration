import React, { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";

export default function Resultats() {
  const [results, setResults] = useState([
    { id: 1, student: "Alice Dupont", course: "Mathématiques", grade: 18 },
    { id: 2, student: "Bob Martin", course: "Programmation", grade: 14 },
    { id: 3, student: "Claire Bernard", course: "Mathématiques", grade: 10 },
  ]);

  const [resultSearch, setResultSearch] = useState("");
  const [resultCourseFilter, setResultCourseFilter] = useState("all");
  const [resultGradeFilter, setResultGradeFilter] = useState("all");

  const handleDeleteResult = (resultId, studentName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le résultat de "${studentName}" ?`)) {
      setResults(results.filter(result => result.id !== resultId));
      alert("Résultat supprimé avec succès !");
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch =
      result.student.toLowerCase().includes(resultSearch.toLowerCase()) ||
      result.course.toLowerCase().includes(resultSearch.toLowerCase());

    const matchesCourse = resultCourseFilter === "all" || result.course === resultCourseFilter;

    let matchesGrade = true;
    if (resultGradeFilter === "excellent") matchesGrade = result.grade >= 16;
    else if (resultGradeFilter === "good") matchesGrade = result.grade >= 12 && result.grade < 16;
    else if (resultGradeFilter === "average") matchesGrade = result.grade < 12;

    return matchesSearch && matchesCourse && matchesGrade;
  });

  return (
    <div className="content flex-grow-1 px-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="mb-2">Résultats des examens</h4>
      </div>

      {/* Barre de recherche et filtres */}
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

      {/* Tableau des résultats */}
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
                    <span
                      className={
                        r.grade >= 16
                          ? "text-success"
                          : r.grade >= 12
                          ? "text-warning"
                          : "text-danger"
                      }
                    >
                      {r.grade}/20
                    </span>
                  </td>
                  <td>
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
  );
}
