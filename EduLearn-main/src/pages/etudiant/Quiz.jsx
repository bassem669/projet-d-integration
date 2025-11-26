import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const Quiz = () => {
  const [activeTab, setActiveTab] = useState('quiz');
  const [quizData, setQuizData] = useState({ quizDisponibles: [], resultatsQuiz: [], evaluations: [] });
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const token = localStorage.getItem("token");

  // -------------------- FETCH QUIZZES, RESULTS, EVALUATIONS --------------------
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const [resQuiz, resResults, resEvaluations] = await Promise.all([
          fetch("http://localhost:5000/api/quiz/student/quizzes", { 
            headers: { "Authorization": `Bearer ${token}` } 
          }),
          fetch("http://localhost:5000/api/quiz/student/results", { 
            headers: { "Authorization": `Bearer ${token}` } 
          }),
          fetch("http://localhost:5000/api/evaluation/pdf", { 
            headers: { "Authorization": `Bearer ${token}` } 
          })
        ]);

        if (!resQuiz.ok) throw new Error("Erreur lors du chargement des quiz");
        if (!resResults.ok) throw new Error("Erreur lors du chargement des résultats");
        if (!resEvaluations.ok) throw new Error("Erreur lors du chargement des évaluations");

        const [quizzes, results, evaluations] = await Promise.all([
          resQuiz.json(), 
          resResults.json(), 
          resEvaluations.json()
        ]);

        setQuizData({ 
          quizDisponibles: quizzes, 
          resultatsQuiz: results, 
          evaluations 
        });
      } catch (error) {
        console.error("Erreur chargement quiz/évaluations:", error);
        alert("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [token]);

  // -------------------- TIMER MANAGEMENT --------------------
  useEffect(() => {
    if (!currentQuiz || !showQuizModal) return;

    const totalTime = currentQuiz.quiz.duree * 60;
    setTimeLeft(totalTime);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuiz, showQuizModal]);

  const handleTimeUp = () => {
    alert("Temps écoulé ! Le quiz sera soumis automatiquement.");
    submitQuiz();
  };

  // -------------------- START QUIZ --------------------
  const startQuiz = async (quizId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/quiz/student/quizzes/${quizId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Erreur récupération quiz");
      
      const data = await res.json();
      setCurrentQuiz(data);
      setCurrentAnswers({});
      setCurrentQuestionIndex(0);
      setQuizStartTime(new Date());
      setShowQuizModal(true);
    } catch (err) {
      console.error(err);
      alert("Impossible de charger le quiz");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- HANDLE ANSWERS --------------------
  const handleAnswerChange = (questionId, answerId, type) => {
    setCurrentAnswers(prev => {
      if (type === "multiple") {
        const prevAnswers = prev[questionId] || [];
        if (prevAnswers.includes(answerId)) {
          return { 
            ...prev, 
            [questionId]: prevAnswers.filter(a => a !== answerId) 
          };
        } else {
          return { 
            ...prev, 
            [questionId]: [...prevAnswers, answerId] 
          };
        }
      } else {
        return { 
          ...prev, 
          [questionId]: answerId 
        };
      }
    });
  };

  // -------------------- NAVIGATION QUESTIONS --------------------
  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // -------------------- SUBMIT QUIZ --------------------
  const submitQuiz = async () => {
    if (!currentQuiz) return;

    const endTime = new Date();
    const tempsUtilise = quizStartTime ? Math.round((endTime - quizStartTime) / 1000) : 0;

    try {
      const answersToSubmit = {};
      Object.keys(currentAnswers).forEach(questionId => {
        const answer = currentAnswers[questionId];
        answersToSubmit[questionId] = Array.isArray(answer) ? answer[0] : answer;
      });

      const res = await fetch(`http://localhost:5000/api/quiz/student/quizzes/${currentQuiz.quiz.idQuiz}/submit`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          reponses: answersToSubmit,
          tempsUtilise: tempsUtilise
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`Quiz soumis avec succès ! Score: ${data.score}% (${data.correctAnswers}/${data.totalQuestions} bonnes réponses)`);
        setShowQuizModal(false);
        setCurrentQuiz(null);
        window.location.reload();
      } else {
        alert(data.message || "Erreur lors de la soumission");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la soumission");
    }
  };

  // -------------------- RENDERING --------------------
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <MenuEtudiant />
        <div className="content">
          <h3 className="mb-4">Quiz & Évaluations</h3>

          <div className="card-modern p-4 mb-4">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
                  📝 Quiz Interactifs
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'evaluations' ? 'active' : ''}`} onClick={() => setActiveTab('evaluations')}>
                  📄 Évaluations PDF
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
                  📊 Mes Résultats
                </button>
              </li>
            </ul>
          </div>

          {/* ---------------- QUIZ LIST ---------------- */}
          {activeTab === 'quiz' && !currentQuiz && (
            <div className="card-modern p-4 mb-4">
              <h5 className="mb-4">📝 Quiz Disponibles</h5>
              {quizData.quizDisponibles.length ? (
                <div className="row g-3">
                  {quizData.quizDisponibles.map(quiz => (
                    <div key={quiz.idQuiz} className="col-md-6">
                      <div className="border rounded p-3">
                        <h6>{quiz.titre}</h6>
                        <p className="text-muted small mb-1"><strong>Cours:</strong> {quiz.nomCours}</p>
                        <p className="text-muted small mb-1"><strong>Questions:</strong> {quiz.nbQuestions}</p>
                        <p className="text-muted small mb-3"><strong>Durée:</strong> {quiz.duree} min</p>
                        <button
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => {
                            const dejaFait = quizData.resultatsQuiz.some(r => r.idQuiz === quiz.idQuiz);
                            if (dejaFait) {
                              alert("Vous avez déjà soumis ce quiz !");
                            } else {
                              startQuiz(quiz.idQuiz);
                            }
                          }}
                        >
                          🚀 Commencer le quiz
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">Aucun quiz disponible.</p>
              )}
            </div>
          )}

{/* ---------------- QUIZ MODAL - VERSION MODERNE ---------------- */}
{showQuizModal && currentQuiz && (
  <div className="quiz-modal-overlay" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 1050
  }}>
    <div className="quiz-modal-container" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '800px',
      height: '90vh',
      maxHeight: '700px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      zIndex: 1060
    }}>
      {/* Header avec gradient moderne */}
      <div className="modal-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        borderBottom: 'none',
        position: 'relative'
      }}>
        <div className="header-content" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <div className="quiz-info">
            <h4 className="modal-title" style={{ 
              margin: 0, 
              fontWeight: '600',
              fontSize: '1.4rem'
            }}>
              {currentQuiz.quiz.titre}
            </h4>
            <div className="quiz-meta" style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              opacity: 0.9
            }}>
              <span>📝 {currentQuiz.questions.length} questions</span>
              <span>⏱️ {formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <button 
            className="close-btn"
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir quitter ? Votre progression sera perdue.")) {
                setShowQuizModal(false);
                setCurrentQuiz(null);
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Barre de progression moderne */}
        <div className="progress-container" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255, 255, 255, 0.3)'
        }}>
          <div 
            className="progress-bar" 
            style={{ 
              height: '100%',
              background: 'linear-gradient(90deg, #00ff88, #00ccff)',
              width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
              transition: 'width 0.3s ease',
              borderRadius: '0 4px 4px 0'
            }}
          ></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="modal-content" style={{
        height: 'calc(100% - 120px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0'
      }}>
        {/* Navigation des questions */}
        <div className="question-nav" style={{
          padding: '1.5rem 2rem 1rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            className="nav-btn prev"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: 'white',
              color: currentQuestionIndex === 0 ? '#94a3b8' : '#475569',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              if (currentQuestionIndex !== 0) {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#cbd5e1';
              }
            }}
            onMouseOut={e => {
              if (currentQuestionIndex !== 0) {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
              }
            }}
          >
            ← Précédent
          </button>
          
          <div className="question-counter" style={{
            background: '#f8fafc',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontWeight: '600',
            color: '#475569',
            fontSize: '0.9rem'
          }}>
            Question <span style={{ color: '#667eea' }}>{currentQuestionIndex + 1}</span> / {currentQuiz.questions.length}
          </div>
          
          <button 
            className="nav-btn next"
            onClick={nextQuestion}
            disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: 'white',
              color: currentQuestionIndex === currentQuiz.questions.length - 1 ? '#94a3b8' : '#475569',
              cursor: currentQuestionIndex === currentQuiz.questions.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              if (currentQuestionIndex !== currentQuiz.questions.length - 1) {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#cbd5e1';
              }
            }}
            onMouseOut={e => {
              if (currentQuestionIndex !== currentQuiz.questions.length - 1) {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
              }
            }}
          >
            Suivant →
          </button>
        </div>

        {/* Question et réponses */}
        <div className="question-section" style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          {currentQuestion && (
            <div className="question-container">
              <div className="question-header" style={{
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {currentQuestion.enonce}
                </h3>
              </div>
              
              <div className="answers-grid" style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {JSON.parse(currentQuestion.reponses).map((r, index) => (
                  <div 
                    key={r.idReponse}
                    className="answer-option"
                    onClick={() => handleAnswerChange(currentQuestion.idQuestion, r.idReponse, currentQuestion.type)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '14px',
                      background: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                    onMouseOver={e => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={e => {
                      const isChecked = currentQuestion.type === "multiple" 
                        ? (currentAnswers[currentQuestion.idQuestion] || []).includes(r.idReponse)
                        : currentAnswers[currentQuestion.idQuestion] === r.idReponse;
                      
                      if (!isChecked) {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div className="answer-selector" style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      border: `2px solid ${
                        currentQuestion.type === "multiple" 
                          ? (currentAnswers[currentQuestion.idQuestion] || []).includes(r.idReponse) ? '#667eea' : '#cbd5e1'
                          : currentAnswers[currentQuestion.idQuestion] === r.idReponse ? '#667eea' : '#cbd5e1'
                      }`,
                      borderRadius: currentQuestion.type === "multiple" ? '4px' : '50%',
                      background: currentQuestion.type === "multiple" 
                        ? (currentAnswers[currentQuestion.idQuestion] || []).includes(r.idReponse) ? '#667eea' : 'white'
                        : currentAnswers[currentQuestion.idQuestion] === r.idReponse ? '#667eea' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px'
                    }}>
                      {currentQuestion.type === "multiple" 
                        ? (currentAnswers[currentQuestion.idQuestion] || []).includes(r.idReponse) && (
                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                          )
                        : currentAnswers[currentQuestion.idQuestion] === r.idReponse && (
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'white'
                            }}></div>
                          )
                      }
                    </div>
                    
                    <div className="answer-content" style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          background: '#667eea',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginRight: '0.75rem'
                        }}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span style={{
                          fontWeight: '500',
                          color: '#1e293b'
                        }}>
                          {r.reponse}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation rapide et footer */}
        <div className="modal-footer" style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid #f1f5f9',
          background: '#f8fafc'
        }}>
          <div className="footer-content" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <div className="quick-nav">
              <div style={{
                fontSize: '0.9rem',
                color: '#64748b',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Navigation rapide :
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {currentQuiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className="quick-nav-btn"
                    onClick={() => goToQuestion(index)}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: 'none',
                      borderRadius: '10px',
                      background: index === currentQuestionIndex 
                        ? '#667eea' 
                        : currentAnswers[currentQuiz.questions[index].idQuestion] 
                          ? '#10b981' 
                          : '#e2e8f0',
                      color: index === currentQuestionIndex ? 'white' : '#475569',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                      if (index !== currentQuestionIndex) {
                        e.target.style.background = '#cbd5e1';
                        e.target.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseOut={e => {
                      if (index !== currentQuestionIndex) {
                        e.target.style.background = currentAnswers[currentQuiz.questions[index].idQuestion] 
                          ? '#10b981' 
                          : '#e2e8f0';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="footer-actions" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{
                fontSize: '0.9rem',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Répondu: <span style={{ 
                  color: '#10b981', 
                  fontWeight: '600' 
                }}>{Object.keys(currentAnswers).length}</span> / {currentQuiz.questions.length}
              </div>
              
              <button 
                className="submit-btn"
                onClick={submitQuiz}
                disabled={Object.keys(currentAnswers).length === 0}
                style={{
                  padding: '0.75rem 2rem',
                  background: Object.keys(currentAnswers).length === 0 
                    ? '#cbd5e1' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: Object.keys(currentAnswers).length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: Object.keys(currentAnswers).length === 0 ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
                onMouseOver={e => {
                  if (Object.keys(currentAnswers).length > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                  }
                }}
                onMouseOut={e => {
                  if (Object.keys(currentAnswers).length > 0) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
                  }
                }}
              >
                ✅ Soumettre le quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          {/* ---------------- AUTRES ONGLETS ---------------- */}
          {activeTab === 'evaluations' && (
            <div className="card-modern p-4 mb-4">
              <h5 className="mb-4">📄 Évaluations à Rendre</h5>
              {quizData.evaluations.length ? (
                <div className="row g-3">
                  {quizData.evaluations.map(e => (
                    <div key={e.idEvaluation} className="col-md-6">
                      <div className="border rounded p-3">
                        <h6>{e.titre}</h6>
                        <p className="text-muted small mb-1"><strong>Cours:</strong> {e.nomCours}</p>
                        <button 
                          className="btn btn-primary btn-sm mt-2"
                          onClick={() => window.open(`http://localhost:5000/uploads/evaluations/evaluation-1764106119460-432252407.pdf`, '_blank')}
                        >
                          📥 Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">Aucune évaluation à rendre.</p>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="card-modern p-4 mb-4">
              <h5 className="mb-4">📊 Mes Résultats</h5>
              {quizData.resultatsQuiz.length ? (
                <div className="row g-3">
                  {quizData.resultatsQuiz.map(result => (
                    <div key={result.idResultat} className="col-md-6">
                      <div className="border rounded p-3">
                        <h6>{result.titreQuiz}</h6>
                        <p className="text-muted small mb-1"><strong>Cours:</strong> {result.nomCours}</p>
                        <p className="text-muted small mb-1"><strong>Note:</strong> 
                          <span className={`fw-bold ${result.note >= 50 ? 'text-success' : 'text-danger'}`}>
                            {Math.round(result.note)}%
                          </span>
                        </p>
                        <p className="text-muted small mb-1">
                          <strong>Date:</strong> {new Date(result.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">Aucun résultat disponible.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Quiz;