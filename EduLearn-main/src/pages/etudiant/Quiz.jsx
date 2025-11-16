import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const Quiz = () => {
  const [activeTab, setActiveTab] = useState('quiz');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation API - À REMPLACER
    setTimeout(() => {
      setQuizData({
        // Section Quiz interactifs
        quizDisponibles: [
          {
            idQuiz: 1,
            titre: "Quiz Mathématiques",
            idCours: 3,
            nomCours: "Mathématiques",
            nbQuestions: 10,
            duree: 30
          },
          {
            idQuiz: 2, 
            titre: "Quiz Programmation",
            idCours: 4,
            nomCours: "Programmation",
            nbQuestions: 15,
            duree: 45
          }
        ],
        resultatsQuiz: [
          {
            idResultat: 1,
            idQuiz: 1,
            titreQuiz: "Quiz Mathématiques",
            note: 85,
            date: "2025-11-15"
          }
        ],

        // Section Évaluations PDF
        evaluations: [
          {
            idEvaluation: 1,
            titre: "Examen Final Mathématiques",
            idCours: 3,
            nomCours: "Mathématiques",
            dateLimite: "2025-12-20",
            fichierEvaluation: "/evaluations/math_final.pdf",
            statut: "a_rendre", // CORRIGÉ : remplacer "à rendre" par "a_rendre"
            fichierReponse: null
          },
          {
            idEvaluation: 2,
            titre: "Devoir Programmation",
            idCours: 4,
            nomCours: "Programmation", 
            dateLimite: "2025-12-15",
            fichierEvaluation: "/evaluations/prog_devoir.pdf",
            statut: "rendu", // CORRIGÉ
            fichierReponse: "/reponses/prog_devoir_rep.pdf"
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (evaluationId) => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier PDF");
      return;
    }

    // Simulation upload - À REMPLACER par appel API
    alert(`Fichier "${selectedFile.name}" téléversé pour l'évaluation ${evaluationId}`);
    setSelectedFile(null);
    
    // Réinitialiser l'input file
    const fileInput = document.getElementById(`file-${evaluationId}`);
    if (fileInput) fileInput.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert("Veuillez sélectionner un fichier PDF");
      e.target.value = '';
    }
  };

  const downloadEvaluation = (fichierUrl, titre) => {
    alert(`Téléchargement: ${titre}`);
    // Implémentation réelle du téléchargement
  };

  const downloadReponse = (fichierUrl, titre) => {
    alert(`Téléchargement de votre réponse: ${titre}`);
    // Implémentation réelle du téléchargement
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <MenuEtudiant />
        
        <div className="content">
          <h3 className="mb-4">Quiz & Évaluations</h3>

          {/* Navigation par onglets */}
          <div className="card-modern p-4 mb-4">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  📝 Quiz Interactifs
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'evaluations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evaluations')}
                >
                  📄 Évaluations PDF
                </button>
              </li>
            </ul>
          </div>

          {/* SECTION QUIZ INTERACTIFS */}
          {activeTab === 'quiz' && (
            <>
              {/* Quiz Disponibles */}
              <div className="card-modern p-4 mb-4">
                <h5 className="mb-4">📝 Quiz Disponibles</h5>
                
                {quizData.quizDisponibles.length > 0 ? (
                  <div className="row g-3">
                    {quizData.quizDisponibles.map(quiz => (
                      <div key={quiz.idQuiz} className="col-md-6">
                        <div className="border rounded p-3">
                          <h6>{quiz.titre}</h6>
                          <p className="text-muted small mb-1">
                            <strong>Cours:</strong> {quiz.nomCours}
                          </p>
                          <p className="text-muted small mb-1">
                            <strong>Questions:</strong> {quiz.nbQuestions}
                          </p>
                          <p className="text-muted small mb-3">
                            <strong>Durée:</strong> {quiz.duree} minutes
                          </p>
                          
                          <Link 
                            to={`/quiz/${quiz.idQuiz}`}
                            className="btn btn-primary btn-sm w-100"
                          >
                            🚀 Commencer le quiz
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">Aucun quiz disponible pour le moment.</p>
                )}
              </div>

              {/* Résultats Quiz */}
              <div className="card-modern p-4">
                <h5 className="mb-4">📊 Mes Résultats - Quiz</h5>
                
                {quizData.resultatsQuiz.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-modern">
                      <thead>
                        <tr>
                          <th>Quiz</th>
                          <th>Note</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizData.resultatsQuiz.map(resultat => (
                          <tr key={resultat.idResultat}>
                            <td>{resultat.titreQuiz}</td>
                            <td>
                              <span className={`badge ${resultat.note >= 70 ? 'bg-success' : 'bg-warning'}`}>
                                {resultat.note}/100
                              </span>
                            </td>
                            <td>{new Date(resultat.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">Aucun résultat de quiz disponible.</p>
                )}
              </div>
            </>
          )}

          {/* SECTION ÉVALUATIONS PDF */}
          {activeTab === 'evaluations' && (
            <>
              {/* Évaluations à rendre */}
              <div className="card-modern p-4 mb-4">
                <h5 className="mb-4">📄 Évaluations à Rendre</h5>
                
                {quizData.evaluations.filter(evaluation => evaluation.statut === 'a_rendre').length > 0 ? (
                  <div className="row g-3">
                    {quizData.evaluations.filter(evaluation => evaluation.statut === 'a_rendre').map(evaluation => (
                      <div key={evaluation.idEvaluation} className="col-md-6">
                        <div className="border rounded p-3">
                          <h6>{evaluation.titre}</h6>
                          <p className="text-muted small mb-1">
                            <strong>Cours:</strong> {evaluation.nomCours}
                          </p>
                          <p className="text-muted small mb-1">
                            <strong>Date limite:</strong> {new Date(evaluation.dateLimite).toLocaleDateString()}
                          </p>
                          
                          <div className="mb-3">
                            <button 
                              className="btn btn-outline-primary btn-sm w-100 mb-2"
                              onClick={() => downloadEvaluation(evaluation.fichierEvaluation, evaluation.titre)}
                            >
                              📥 Télécharger l'énoncé
                            </button>
                          </div>

                          {/* Upload de réponse */}
                          <div>
                            <input
                              id={`file-${evaluation.idEvaluation}`}
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              className="form-control form-control-sm mb-2"
                            />
                            <button 
                              className="btn btn-success btn-sm w-100"
                              onClick={() => handleFileUpload(evaluation.idEvaluation)}
                            >
                              📤 Déposer ma réponse
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">Aucune évaluation à rendre.</p>
                )}
              </div>

              {/* Évaluations rendues */}
              <div className="card-modern p-4">
                <h5 className="mb-4">✅ Évaluations Rendues</h5>
                
                {quizData.evaluations.filter(evaluation => evaluation.statut === 'rendu').length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-modern">
                      <thead>
                        <tr>
                          <th>Évaluation</th>
                          <th>Cours</th>
                          <th>Date rendu</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizData.evaluations.filter(evaluation => evaluation.statut === 'rendu').map(evaluation => (
                          <tr key={evaluation.idEvaluation}>
                            <td>{evaluation.titre}</td>
                            <td>{evaluation.nomCours}</td>
                            <td>{new Date(evaluation.dateLimite).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => downloadReponse(evaluation.fichierReponse, evaluation.titre)}
                              >
                                📥 Ma réponse
                              </button>
                              <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => downloadEvaluation(evaluation.fichierEvaluation, evaluation.titre)}
                              >
                                📄 Énoncé
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">Aucune évaluation rendue.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Quiz;