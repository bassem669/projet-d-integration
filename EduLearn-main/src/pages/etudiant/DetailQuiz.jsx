import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../Navbar";
import MenuEtudiant from './MenuEtudiant';
import './theme_etudiant.css';

const DetailQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reponses, setReponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation API - À REMPLACER
    setTimeout(() => {
      setQuiz({
        idQuiz: parseInt(id),
        titre: "Quiz Mathématiques",
        duree: 30,
        questions: [
          {
            idQuestion: 1,
            enonce: "Quelle est la dérivée de x²?",
            reponses: [
              { idReponse: 1, reponse: "2x" },
              { idReponse: 2, reponse: "x" },
              { idReponse: 3, reponse: "2" }
            ]
          },
          {
            idQuestion: 2,
            enonce: "2 + 2 = ?",
            reponses: [
              { idReponse: 4, reponse: "4" },
              { idReponse: 5, reponse: "3" },
              { idReponse: 6, reponse: "5" }
            ]
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleReponse = (reponseId) => {
    const nouvelleReponse = {
      questionId: quiz.questions[currentQuestion].idQuestion,
      reponseId: reponseId
    };
    
    setReponses([...reponses, nouvelleReponse]);
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz terminé
      alert("🎉 Quiz terminé ! Résultats en cours de calcul...");
      // Ici vous enverrez les réponses au backend
    }
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
              <p className="mt-2 text-muted">Chargement du quiz...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!quiz) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <MenuEtudiant />
          <div className="content">
            <div className="text-center py-5">
              <p className="text-muted">Quiz non trouvé</p>
              <Link to="/quiz" className="btn btn-primary">
                ← Retour aux quiz
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progression = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <MenuEtudiant />
        
        <div className="content">
          {/* Navigation */}
          <div className="mb-4">
            <Link to="/quiz" className="btn btn-outline-primary btn-sm">
              ← Retour aux quiz
            </Link>
          </div>

          {/* En-tête quiz */}
          <div className="card-modern p-4 mb-4">
            <h1 className="mb-3">{quiz.titre}</h1>
            
            {/* Progression */}
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">
                  Question {currentQuestion + 1} sur {quiz.questions.length}
                </span>
                <span className="text-muted">
                  {quiz.duree} minutes
                </span>
              </div>
              <div className="progress-modern">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progression}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question actuelle */}
          <div className="card-modern p-4">
            <h5 className="mb-4">Question {currentQuestion + 1}</h5>
            <p className="mb-4 fs-5">{question.enonce}</p>
            
            <div className="d-grid gap-3">
              {question.reponses.map(reponse => (
                <button
                  key={reponse.idReponse}
                  className="btn btn-outline-primary py-3 text-start"
                  onClick={() => handleReponse(reponse.idReponse)}
                >
                  {reponse.reponse}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation entre questions */}
          {quiz.questions.length > 1 && (
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-outline-secondary"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                ← Question précédente
              </button>
              
              <button
                className="btn btn-outline-secondary"
                disabled={currentQuestion === quiz.questions.length - 1}
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Question suivante →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailQuiz;