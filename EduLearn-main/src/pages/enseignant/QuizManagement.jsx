import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBookOpen,
  FaPlus,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaQuestionCircle,
  FaClock,
  FaListAlt,
  FaExclamationCircle,
  FaFilePdf,
  FaDownload,
  FaCalendarAlt,
  FaUserGraduate
} from "react-icons/fa";
import "./TeacherDashboard.css";

export default function QuizAndEvaluationManagement() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem('token');
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // États pour les quiz
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [quizSearch, setQuizSearch] = useState("");
  const [quizLoading, setQuizLoading] = useState(true);

  // États pour les évaluations
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationDetails, setEvaluationDetails] = useState(null);
  const [evaluationSearch, setEvaluationSearch] = useState("");
  const [evaluationLoading, setEvaluationLoading] = useState(true);

  // États pour les formulaires
  const [activeForm, setActiveForm] = useState(null);
  const [newQuiz, setNewQuiz] = useState({
    id: null,
    titre: "",
    description: "",
    idCours: "",
    duree: 30,
    nbQuestions: 1,
    actif: true,
    questions: []
  });

  const [newEvaluation, setNewEvaluation] = useState({
    id: null,
    titre: "",
    description: "",
    idCours: "",
    dateLimite: "",
    fichier: null
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    enonce: "",
    type: "choix_multiple",
    ordre: 0,
    reponses: [
      { reponse: "", correct: false },
      { reponse: "", correct: false },
      { reponse: "", correct: false },
      { reponse: "", correct: false }
    ]
  });

  useEffect(() => {
    fetchQuizzes();
    fetchEvaluations();
    fetchCourses();
  }, []);

  // ==================== FONCTIONS QUIZ ====================
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teacher/quizzes', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des quiz');
      const data = await response.json();
      
      const mappedQuizzes = data.map(q => ({
        id: q.idQuiz,
        titre: q.titre,
        description: q.description,
        duree: q.duree,
        nbQuestions: q.nbQuestions,
        actif: q.actif,
        nomCours: q.nomCours,
        created_at: q.created_at
      }));
      
      setQuizzes(mappedQuizzes);
      setQuizLoading(false);
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des quiz");
      setQuizLoading(false);
    }
  };

  const fetchQuizDetails = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/quizzes/${quizId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
      const data = await response.json();
      setQuizDetails(data);
      setActiveForm("detailsQuiz");
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des détails");
    }
  };

  const fetchQuizResults = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/quizzes/${quizId}/results`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des résultats');
      const data = await response.json();
      setQuizResults(data);
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des résultats");
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    if (!newQuiz.titre || !newQuiz.idCours || newQuiz.questions.length === 0) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires et ajouter au moins une question !");
      return;
    }

    if (newQuiz.questions.length !== newQuiz.nbQuestions) {
      showNotification("error", `Vous avez ajouté ${newQuiz.questions.length} questions, mais vous avez spécifié ${newQuiz.nbQuestions} questions. Veuillez ajouter le bon nombre de questions.`);
      return;
    }

    try {
      const quizData = {
        titre: newQuiz.titre,
        description: newQuiz.description,
        idCours: newQuiz.idCours,
        duree: newQuiz.duree,
        nbQuestions: newQuiz.nbQuestions,
        actif: newQuiz.actif,
        questions: newQuiz.questions
      };
      
      const response = await fetch("http://localhost:5000/api/teacher/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification("error", data.message || "Erreur lors de la création du quiz !");
        return;
      }

      setQuizzes([...quizzes, { ...newQuiz, id: data.idQuiz }]);
      showNotification("success", "Quiz créé avec succès !");
      resetQuizForm();
      setActiveForm(null);
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    if (!newQuiz.titre || !newQuiz.idCours || newQuiz.questions.length === 0) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    if (newQuiz.questions.length !== newQuiz.nbQuestions) {
      showNotification("error", `Vous avez ajouté ${newQuiz.questions.length} questions, mais vous avez spécifié ${newQuiz.nbQuestions} questions. Veuillez ajouter le bon nombre de questions.`);
      return;
    }

    try {
      const updatedData = {
        titre: newQuiz.titre,
        description: newQuiz.description,
        idCours: newQuiz.idCours,
        duree: newQuiz.duree,
        nbQuestions: newQuiz.nbQuestions,
        actif: newQuiz.actif,
        questions: newQuiz.questions
      };

      const response = await fetch(`http://localhost:5000/api/teacher/quizzes/${newQuiz.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification("error", data.message || "Erreur lors de la mise à jour du quiz !");
        return;
      }

      const updatedQuizzes = quizzes.map((q) =>
        q.id === newQuiz.id ? newQuiz : q
      );

      setQuizzes(updatedQuizzes);
      showNotification("success", "Quiz modifié avec succès !");
      resetQuizForm();
      setActiveForm(null);
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleDeleteQuiz = async (id, titre) => {
    if (!window.confirm(`Supprimer le quiz "${titre}" ? Cette action est irréversible.`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/teacher/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors de la suppression du quiz !");
        return;
      }

      setQuizzes(quizzes.filter((q) => q.id !== id));
      showNotification("success", "Quiz supprimé avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const toggleQuizStatus = async (quiz) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/quizzes/${quiz.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ actif: !quiz.actif })
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors du changement de statut !");
        return;
      }

      const updatedQuizzes = quizzes.map((q) =>
        q.id === quiz.id ? { ...q, actif: !q.actif } : q
      );

      setQuizzes(updatedQuizzes);
      showNotification("success", `Quiz ${!quiz.actif ? 'activé' : 'désactivé'} avec succès !`);
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  // ==================== FONCTIONS ÉVALUATIONS ====================
  const fetchEvaluations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teacher/evaluations', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des évaluations');
      const data = await response.json();
      
      const mappedEvaluations = data.map(e => ({
        id: e.idEvaluation,
        titre: e.titre,
        description: e.description,
        dateLimite: e.dateLimite,
        fichierEvaluation: e.fichierEvaluation,
        actif: e.actif,
        nomCours: e.nomCours,
        created_at: e.created_at
      }));
      
      setEvaluations(mappedEvaluations);
      setEvaluationLoading(false);
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des évaluations");
      setEvaluationLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teacher/courses', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des cours");
    }
  };

  const fetchEvaluationDetails = async (evaluationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/evaluations/${evaluationId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
      const data = await response.json();
      setEvaluationDetails(data);
      setActiveForm("detailsEvaluation");
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des détails");
    }
  };

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();

    if (!newEvaluation.titre || !newEvaluation.idCours || !newEvaluation.fichier) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires et sélectionner un fichier !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titre', newEvaluation.titre);
      formData.append('description', newEvaluation.description);
      formData.append('idCours', newEvaluation.idCours);
      formData.append('dateLimite', newEvaluation.dateLimite);
      formData.append('fichier', newEvaluation.fichier);
      
      const response = await fetch("http://localhost:5000/api/teacher/evaluations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification("error", data.message || "Erreur lors de la création de l'évaluation !");
        return;
      }

      setEvaluations([...evaluations, { ...newEvaluation, id: data.idEvaluation }]);
      showNotification("success", "Évaluation créée avec succès !");
      resetEvaluationForm();
      setActiveForm(null);
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleDeleteEvaluation = async (id, titre) => {
    if (!window.confirm(`Supprimer l'évaluation "${titre}" ? Cette action est irréversible.`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/teacher/evaluations/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors de la suppression de l'évaluation !");
        return;
      }

      setEvaluations(evaluations.filter((e) => e.id !== id));
      showNotification("success", "Évaluation supprimée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const toggleEvaluationStatus = async (evaluation) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/evaluations/${evaluation.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ actif: !evaluation.actif })
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors du changement de statut !");
        return;
      }

      const updatedEvaluations = evaluations.map((e) =>
        e.id === evaluation.id ? { ...e, actif: !e.actif } : e
      );

      setEvaluations(updatedEvaluations);
      showNotification("success", `Évaluation ${!evaluation.actif ? 'activée' : 'désactivée'} avec succès !`);
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  // Fonction pour noter les réponses des étudiants (manquante dans le code original)
  const handleGradeResponse = async (reponseId, note, commentaire) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/evaluations/responses/${reponseId}/grade`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ note, commentaire })
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors de la notation !");
        return;
      }

      showNotification("success", "Réponse notée avec succès !");
      // Recharger les détails
      if (evaluationDetails) {
        fetchEvaluationDetails(evaluationDetails.evaluation.idEvaluation);
      }
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  // ==================== FONCTIONS COMMUNES ====================
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const resetQuizForm = () => {
    setNewQuiz({
      id: null,
      titre: "",
      description: "",
      idCours: "",
      duree: 30,
      nbQuestions: 1,
      actif: true,
      questions: []
    });
    setCurrentQuestion({
      enonce: "",
      type: "choix_multiple",
      ordre: 0,
      reponses: [
        { reponse: "", correct: false },
        { reponse: "", correct: false },
        { reponse: "", correct: false },
        { reponse: "", correct: false }
      ]
    });
  };

  const resetEvaluationForm = () => {
    setNewEvaluation({
      id: null,
      titre: "",
      description: "",
      idCours: "",
      dateLimite: "",
      fichier: null
    });
  };

  // ==================== GESTION DES QUESTIONS ====================
  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleAnswerChange = (index, field, value) => {
    const newReponses = [...currentQuestion.reponses];
    
    if (field === 'correct') {
      if (currentQuestion.type === 'choix_multiple') {
        newReponses.forEach((rep, i) => {
          // Pour choix multiple: une seule réponse correcte
          newReponses[i] = { ...rep, correct: i === index };
        });
      } else if (currentQuestion.type === 'vrai_faux') {
        // Pour vrai/faux: géré séparément dans le composant
        // Cette logique est maintenant gérée directement dans le rendu
      }
    } else {
      newReponses[index] = { ...newReponses[index], [field]: value };
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      reponses: newReponses
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.enonce.trim()) {
      showNotification("error", "Veuillez saisir l'énoncé de la question");
      return;
    }

    // Pour les questions Vrai/Faux, s'assurer que les réponses sont pré-remplies
    let questionToAdd = { ...currentQuestion };
    if (currentQuestion.type === 'vrai_faux') {
      questionToAdd.reponses = [
        { reponse: "Vrai", correct: currentQuestion.reponses[0]?.correct || false },
        { reponse: "Faux", correct: currentQuestion.reponses[1]?.correct || false }
      ];
    }

    const hasCorrectAnswer = currentQuestion.reponses.some(r => r.correct && r.reponse.trim());
    if (!hasCorrectAnswer) {
      showNotification("error", "Veuillez sélectionner au moins une réponse correcte");
      return;
    }

    const allAnswersFilled = currentQuestion.type === 'vrai_faux' ? 
      true : // Pour Vrai/Faux, les réponses sont pré-remplies
      questionToAdd.reponses.every(r => r.reponse.trim() !== '');
  
    if (!allAnswersFilled) {
      showNotification("error", "Veuillez remplir toutes les réponses");
    return;
    }

    const newQuestions = [...newQuiz.questions, {
      ...questionToAdd,
      ordre: newQuiz.questions.length
    }];

    setNewQuiz({
      ...newQuiz,
      questions: newQuestions
    });

    // Réinitialiser avec les valeurs par défaut selon le type
    setCurrentQuestion({
      enonce: "",
      type: currentQuestion.type, // Garder le même type
      ordre: newQuestions.length,
      reponses: currentQuestion.type === 'vrai_faux' ? [
        { reponse: "Vrai", correct: false },
        { reponse: "Faux", correct: false }
      ] : [
        { reponse: "", correct: false },
        { reponse: "", correct: false },
        { reponse: "", correct: false },
        { reponse: "", correct: false }
      ]
    });

    showNotification("success", "Question ajoutée avec succès !");
  };

  const removeQuestion = (index) => {
    const newQuestions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({
      ...newQuiz,
      questions: newQuestions
    });
    showNotification("success", "Question supprimée !");
  };

  const handleNbQuestionsChange = (value) => {
    const nbQuestions = parseInt(value) || 1;
    setNewQuiz({
      ...newQuiz,
      nbQuestions: Math.max(1, nbQuestions)
    });
  };

  const getProgressPercentage = () => {
    if (newQuiz.nbQuestions === 0) return 0;
    return Math.min(100, Math.round((newQuiz.questions.length / newQuiz.nbQuestions) * 100));
  };

  const isQuestionsComplete = () => {
    return newQuiz.questions.length >= newQuiz.nbQuestions;
  };

  // ==================== FILTRAGE ====================
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.titre.toLowerCase().includes(quizSearch.toLowerCase()) ||
    quiz.nomCours?.toLowerCase().includes(quizSearch.toLowerCase())
  );

  const filteredEvaluations = evaluations.filter((evaluation) =>
    evaluation.titre.toLowerCase().includes(evaluationSearch.toLowerCase()) ||
    evaluation.nomCours?.toLowerCase().includes(evaluationSearch.toLowerCase())
  );

  // ==================== RENDU PRINCIPAL ====================
  return (
    <div className="cours-container p-4">
      {/* Notification */}
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

      {/* Vue principale avec les deux tableaux */}
      {!activeForm && (
        <>
          {/* Section Quiz */}
          <div className="card-modern mb-4">
            <div className="card-header" style={{ borderBottom: '2px solid #dee2e6', backgroundColor: 'transparent' }}>
              <div className="d-flex justify-content-between align-items-center mb-4"> {/* Augmentation de l'espacement avec mb-4 */}
                <h4 className="mb-0">
                  <FaQuestionCircle className="me-2" /> Gestion des Quiz
                </h4>
                <button
                  className="btn"
                  style={{ backgroundColor: "#ff8800", color: "#fff" }}
                  onClick={() => setActiveForm("ajouterQuiz")}
                >
                  <FaPlus /> Créer un Quiz
                </button>
              </div>
              {/* Recherche Quiz */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher un quiz ou un cours..."
                      value={quizSearch}
                      onChange={(e) => setQuizSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tableau Quiz */}
              <div className="table-responsive">
                <table className="table table-modern align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>Titre</th>
                      <th>Description</th>
                      <th>Durée</th>
                      <th>Questions</th>
                      <th>Cours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="spinner-border text-primary"></div>
                        </td>
                      </tr>
                    ) : filteredQuizzes.length > 0 ? (
                      filteredQuizzes.map((q) => (
                        <tr key={q.id}>
                          <td><strong>{q.titre}</strong></td>
                          <td>{q.description || "—"}</td>
                          <td><FaClock className="me-1" /> {q.duree} min</td>
                          <td><FaListAlt className="me-1" /> {q.nbQuestions}</td>
                          <td>{q.nomCours || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          {quizzes.length === 0 ? "Aucun quiz créé pour le moment" : "Aucun quiz trouvé"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section Évaluations */}
          <div className="card-modern">
            <div className="card-header" style={{ borderBottom: '2px solid #dee2e6', backgroundColor: 'transparent' }}>
              <div className="d-flex justify-content-between align-items-center mb-4"> {/* Augmentation de l'espacement avec mb-4 */}
                <h4 className="mb-0">
                  <FaFilePdf className="me-2" /> Gestion des Évaluations
                </h4>
                <button
                  className="btn"
                  style={{ backgroundColor: "#ff8800", color: "#fff" }}
                  onClick={() => setActiveForm("ajouterEvaluation")}
                >
                  <FaPlus /> Ajouter une Évaluation
                </button>
              </div>
              {/* Recherche Évaluations */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher une évaluation ou un cours..."
                      value={evaluationSearch}
                      onChange={(e) => setEvaluationSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tableau Évaluations */}
              <div className="table-responsive">
                <table className="table table-modern align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Titre</th>
                      <th>Description</th>
                      <th>Date limite</th>
                      <th>Fichier</th>
                      <th>Cours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="spinner-border text-success"></div>
                        </td>
                      </tr>
                    ) : filteredEvaluations.length > 0 ? (
                      filteredEvaluations.map((e) => (
                        <tr key={e.id}>
                          <td><strong>{e.titre}</strong></td>
                          <td>{e.description || "—"}</td>
                          <td>
                            <FaCalendarAlt className="me-1" /> 
                            {e.dateLimite ? new Date(e.dateLimite).toLocaleDateString('fr-FR') : "—"}
                          </td>
                          <td>
                            <FaFilePdf className="me-1 text-danger" /> 
                            {e.fichierEvaluation ? "PDF" : "—"}
                          </td>
                          <td>{e.nomCours || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          {evaluations.length === 0 ? "Aucune évaluation créée pour le moment" : "Aucune évaluation trouvée"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== FORMULAIRES ET DÉTAILS ==================== */}

      {/* Détails Quiz */}
      {activeForm === "detailsQuiz" && quizDetails && (
        <div className="card-modern p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Détails du Quiz: {quizDetails.quiz.titre}</h4>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setActiveForm(null);
                setQuizDetails(null);
              }}
            >
              ← Retour
            </button>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Description:</strong> {quizDetails.quiz.description || "—"}</p>
              <p><strong>Cours:</strong> {quizDetails.quiz.nomCours || "—"}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Durée:</strong> {quizDetails.quiz.duree} minutes</p>
              <p><strong>Nombre de questions:</strong> {quizDetails.quiz.nbQuestions}</p>
              <p><strong>Statut:</strong> 
                <span className={`badge ${quizDetails.quiz.actif ? 'bg-success' : 'bg-secondary'} ms-2`}>
                  {quizDetails.quiz.actif ? 'Actif' : 'Inactif'}
                </span>
              </p>
            </div>
          </div>

          <h5>Questions:</h5>
          {quizDetails.questions.map((question, index) => (
            <div key={question.idQuestion} className="card mb-3">
              <div className="card-body">
                <h6>Question {index + 1}: {question.enonce}</h6>
                <div className="mt-2">
                  <strong>Réponses:</strong>
                  <ul className="list-unstyled mt-2">
                    {question.reponses && question.reponses.map((reponse, repIndex) => (
                      <li 
                        key={repIndex} 
                        className={`ps-3 ${reponse.correct ? 'text-success fw-bold' : 'text-muted'}`}
                      >
                        {reponse.reponse} {reponse.correct && ' ✓'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <button
            className="btn btn-primary mt-3"
            onClick={() => fetchQuizResults(quizDetails.quiz.idQuiz)}
          >
            Voir les résultats des étudiants
          </button>

          {quizResults.length > 0 && (
            <div className="mt-4">
              <h5>Résultats des étudiants:</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Étudiant</th>
                      <th>Note</th>
                      <th>Temps utilisé</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.map(result => (
                      <tr key={result.idResultat}>
                        <td>{result.prenom} {result.nom}</td>
                        <td className={result.note >= 50 ? 'text-success fw-bold' : 'text-danger'}>
                          {Math.round(result.note)}%
                        </td>
                        <td>{result.tempsUtilise || 0}s</td>
                        <td>{new Date(result.date).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Détails Évaluation */}
      {activeForm === "detailsEvaluation" && evaluationDetails && (
        <div className="card-modern p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Détails de l'Évaluation: {evaluationDetails.evaluation.titre}</h4>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setActiveForm(null);
                setEvaluationDetails(null);
              }}
            >
              ← Retour
            </button>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Description:</strong> {evaluationDetails.evaluation.description || "—"}</p>
              <p><strong>Cours:</strong> {evaluationDetails.evaluation.nomCours || "—"}</p>
              <p><strong>Fichier:</strong> 
                {evaluationDetails.evaluation.fichierEvaluation && (
                  <span className="ms-2">
                    <FaFilePdf className="text-danger me-1" />
                    {evaluationDetails.evaluation.fichierEvaluation}
                  </span>
                )}
              </p>
            </div>
            <div className="col-md-6">
              <p><strong>Date limite:</strong> 
                {evaluationDetails.evaluation.dateLimite ? 
                  new Date(evaluationDetails.evaluation.dateLimite).toLocaleDateString('fr-FR') : "—"
                }
              </p>
              <p><strong>Statut:</strong> 
                <span className={`badge ${evaluationDetails.evaluation.actif ? 'bg-success' : 'bg-secondary'} ms-2`}>
                  {evaluationDetails.evaluation.actif ? 'Actif' : 'Inactif'}
                </span>
              </p>
              <p><strong>Créée le:</strong> 
                {new Date(evaluationDetails.evaluation.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <h5>Réponses des étudiants ({evaluationDetails.reponses.length})</h5>
          {evaluationDetails.reponses.length > 0 ? (
            <div className="table-responsive mt-3">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Date soumission</th>
                    <th>Fichier réponse</th>
                    <th>Statut</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationDetails.reponses.map((reponse) => (
                    <tr key={reponse.idReponse}>
                      <td>{reponse.prenom} {reponse.nom}</td>
                      <td>{new Date(reponse.dateSoumission).toLocaleDateString('fr-FR')}</td>
                      <td>
                        {reponse.fichierReponse && (
                          <FaFilePdf className="text-primary" title="Fichier réponse" />
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          reponse.statut === 'corrigé' ? 'bg-success' : 
                          reponse.statut === 'soumis' ? 'bg-warning' : 'bg-secondary'
                        }`}>
                          {reponse.statut}
                        </span>
                      </td>
                      <td>
                        {reponse.note !== null ? `${reponse.note}/20` : "—"}
                      </td>
                      <td>
                        {reponse.statut !== 'corrigé' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              const note = prompt("Note (sur 20):");
                              const commentaire = prompt("Commentaire:");
                              if (note && commentaire) {
                                handleGradeResponse(reponse.idReponse, parseFloat(note), commentaire);
                              }
                            }}
                          >
                            Noter
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <FaUserGraduate className="me-2" />
              Aucune réponse soumise pour le moment.
            </div>
          )}
        </div>
      )}

      {/* Formulaire Quiz */}
      {(activeForm === "ajouterQuiz" || activeForm === "modifierQuiz") && (
        <div className="card-modern p-4">
          <h4>{activeForm === "modifierQuiz" ? "Modifier le quiz" : "Créer un nouveau quiz"}</h4>
          <form onSubmit={activeForm === "modifierQuiz" ? handleUpdateQuiz : handleQuizSubmit}>
            {/* Titre */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Titre *</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={newQuiz.titre}
                  onChange={(e) => setNewQuiz({ ...newQuiz, titre: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Description</label>
              <div className="col-sm-10">
                <textarea
                  className="form-control"
                  rows="3"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  placeholder="Description du quiz..."
                ></textarea>
              </div>
            </div>

            {/* Cours associé */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Cours *</label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  value={newQuiz.idCours}
                  onChange={(e) => setNewQuiz({ ...newQuiz, idCours: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map(course => (
                    <option key={course.idCours} value={course.idCours}>
                      {course.titre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Durée et nombre de questions */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Durée (minutes) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={newQuiz.duree}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duree: parseInt(e.target.value) || 30 })}
                  min="1"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nombre de questions *</label>
                <input
                  type="number"
                  className="form-control"
                  value={newQuiz.nbQuestions}
                  onChange={(e) => handleNbQuestionsChange(e.target.value)}
                  min="1"
                  required
                />
                <small className="text-muted">Saisissez le nombre total de questions que vous souhaitez créer</small>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="row mb-3">
              <div className="col-12">
                <div className="progress-container">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">
                      Progression des questions: {newQuiz.questions.length} / {newQuiz.nbQuestions}
                    </span>
                    <span className={`badge ${isQuestionsComplete() ? 'bg-success' : 'bg-warning'}`}>
                      {isQuestionsComplete() ? 'Complet' : 'En cours'}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div 
                      className={`progress-bar ${isQuestionsComplete() ? 'bg-success' : 'bg-primary'}`}
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Ajout de Questions */}
            <div className="questions-section mt-4 p-3 border rounded">
              <h5 className="mb-3">
                <FaListAlt className="me-2" />
                Questions ({newQuiz.questions.length} sur {newQuiz.nbQuestions} ajoutées) *
              </h5>

              {/* Message d'alerte si le nombre de questions n'est pas atteint */}
              {!isQuestionsComplete() && (
                <div className="alert alert-warning d-flex align-items-center">
                  <FaExclamationCircle className="me-2" />
                  <div>
                    <strong>Attention:</strong> Vous devez ajouter {newQuiz.nbQuestions - newQuiz.questions.length} question(s) supplémentaire(s) pour compléter le quiz.
                  </div>
                </div>
              )}

              {/* Message de succès si le nombre de questions est atteint */}
              {isQuestionsComplete() && (
                <div className="alert alert-success d-flex align-items-center">
                  <FaCheckCircle className="me-2" />
                  <div>
                    <strong>Parfait!</strong> Vous avez ajouté toutes les questions nécessaires. Vous pouvez maintenant créer le quiz.
                  </div>
                </div>
              )}

              {/* Formulaire d'ajout de question (uniquement si pas complet) */}
              {!isQuestionsComplete() && (
                <div className="question-form p-3 bg-light rounded mb-3">
                  <h6>Ajouter une nouvelle question</h6>
                  
                  <div className="mb-3">
                    <label className="form-label">Énoncé de la question *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="enonce"
                      value={currentQuestion.enonce}
                      onChange={handleQuestionChange}
                      placeholder="Saisissez la question..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Type de question</label>
                    <select
                      className="form-control"
                      name="type"
                      value={currentQuestion.type}
                      onChange={handleQuestionChange}
                    >
                      <option value="choix_multiple">Choix Multiple</option>
                      <option value="vrai_faux">Vrai/Faux</option>
                    </select>
                  </div>

                  {currentQuestion.type === 'choix_multiple' && (
                    <div className="answers-section">
                      <label className="form-label">Réponses possibles *</label>
                      {currentQuestion.reponses.map((reponse, index) => (
                        <div key={index} className="answer-row d-flex align-items-center mb-2">
                          <input
                            type="text"
                            className="form-control me-2"
                            placeholder={`Réponse ${index + 1}`}
                            value={reponse.reponse}
                            onChange={(e) => handleAnswerChange(index, 'reponse', e.target.value)}
                            required
                          />
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="correctAnswer"
                              checked={reponse.correct}
                              onChange={() => handleAnswerChange(index, 'correct', true)}
                            />
                            <label className="form-check-label">Correcte</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* cette section pour le type Vrai/Faux */}
                  {currentQuestion.type === 'vrai_faux' && (
                    <div className="answers-section">
                      <label className="form-label">Options Vrai/Faux *</label>
                      <div className="vrai-faux-options">
                        <div className="answer-row d-flex align-items-center mb-2">
                          <div className="form-control me-2 bg-light">Vrai</div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="correctAnswerVraiFaux"
                              checked={currentQuestion.reponses[0].correct}
                              onChange={() => {
                                const newReponses = [...currentQuestion.reponses];
                                newReponses[0] = { reponse: "Vrai", correct: true };
                                newReponses[1] = { reponse: "Faux", correct: false };
                                setCurrentQuestion({
                                  ...currentQuestion,
                                  reponses: newReponses
                                });
                              }}
                            />
                            <label className="form-check-label">Correct</label>
                          </div>
                        </div>
                        <div className="answer-row d-flex align-items-center mb-2">
                          <div className="form-control me-2 bg-light">Faux</div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="correctAnswerVraiFaux"
                              checked={currentQuestion.reponses[1].correct}
                              onChange={() => {
                                const newReponses = [...currentQuestion.reponses];
                                newReponses[0] = { reponse: "Vrai", correct: false };
                                newReponses[1] = { reponse: "Faux", correct: true };
                                setCurrentQuestion({
                                  ...currentQuestion,
                                  reponses: newReponses
                                });
                              }}
                            />
                            <label className="form-check-label">Correct</label>
                          </div>
                        </div>
                      </div>
                      <small className="text-muted">Sélectionnez la réponse correcte (Vrai ou Faux)</small>
                    </div>
                  )}

                  <button 
                    type="button" 
                    className="btn btn-secondary mt-2"
                    onClick={addQuestion}
                  >
                    <FaPlus /> Ajouter cette Question
                  </button>
                </div>
              )}

              {/* Liste des questions ajoutées */}
              {newQuiz.questions.length > 0 && (
                <div className="added-questions">
                  <h6>Questions ajoutées :</h6>
                  {newQuiz.questions.map((question, index) => (
                    <div key={index} className="question-item card mb-2">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <strong>Q{index + 1}:</strong> {question.enonce}
                            <div className="mt-2">
                              <small className="text-muted">
                                <strong>Réponses:</strong> 
                                {question.reponses.map((rep, repIndex) => (
                                  <span 
                                    key={repIndex} 
                                    className={`ms-2 ${rep.correct ? 'text-success fw-bold' : 'text-muted'}`}
                                  >
                                    {rep.reponse} {rep.correct && '✓'}
                                  </span>
                                ))}
                              </small>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => removeQuestion(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetQuizForm();
                  setActiveForm(null);
                }}
              >
                ← Retour
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!isQuestionsComplete() || newQuiz.questions.length === 0}
              >
                {activeForm === "modifierQuiz" ? "Mettre à jour le quiz" : "Créer le quiz"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire Évaluation */}
      {(activeForm === "ajouterEvaluation" || activeForm === "modifierEvaluation") && (
        <div className="card-modern p-4">
          <h4>{activeForm === "modifierEvaluation" ? "Modifier l'évaluation" : "Créer une nouvelle évaluation"}</h4>
          <form onSubmit={handleEvaluationSubmit}>
            {/* Titre */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Titre *</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={newEvaluation.titre}
                  onChange={(e) => setNewEvaluation({ ...newEvaluation, titre: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Description</label>
              <div className="col-sm-10">
                <textarea
                  className="form-control"
                  rows="3"
                  value={newEvaluation.description}
                  onChange={(e) => setNewEvaluation({ ...newEvaluation, description: e.target.value })}
                  placeholder="Description de l'évaluation..."
                ></textarea>
              </div>
            </div>

            {/* Cours associé */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Cours *</label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  value={newEvaluation.idCours}
                  onChange={(e) => setNewEvaluation({ ...newEvaluation, idCours: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map(course => (
                    <option key={course.idCours} value={course.idCours}>
                      {course.titre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date limite */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Date limite</label>
              <div className="col-sm-10">
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newEvaluation.dateLimite}
                  onChange={(e) => setNewEvaluation({ ...newEvaluation, dateLimite: e.target.value })}
                />
                <small className="text-muted">Laisser vide si pas de date limite</small>
              </div>
            </div>

            {/* Fichier PDF */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Fichier PDF *</label>
              <div className="col-sm-10">
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={(e) => setNewEvaluation({ ...newEvaluation, fichier: e.target.files[0] })}
                  required={activeForm === "ajouterEvaluation"}
                />
                <small className="text-muted">Format accepté: PDF (max 10MB)</small>
                {activeForm === "modifierEvaluation" && newEvaluation.fichierEvaluation && (
                  <div className="mt-2">
                    <span className="text-success">
                      <FaFilePdf className="me-1" />
                      Fichier actuel: {newEvaluation.fichierEvaluation}
                    </span>
                    <small className="text-muted ms-2">(Laisser vide pour conserver le fichier actuel)</small>
                  </div>
                )}
              </div>
            </div>

            {/* Boutons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetEvaluationForm();
                  setActiveForm(null);
                }}
              >
                ← Retour
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                {activeForm === "modifierEvaluation" ? "Mettre à jour l'évaluation" : "Créer l'évaluation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}