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
  FaUserGraduate,
  FaEdit,
  FaEye,
  FaUpload,
  FaFile,
  FaUsers,
  FaChartBar,
  FaChartLine,
  FaTrophy
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

  // États pour les évaluations PDF
  const [evaluationsPDF, setEvaluationsPDF] = useState([]);
  const [evaluationPDFDetails, setEvaluationPDFDetails] = useState(null);
  const [evaluationPDFSearch, setEvaluationPDFSearch] = useState("");
  const [evaluationPDFLoading, setEvaluationPDFLoading] = useState(true);

  // États pour les formulaires
  const [activeForm, setActiveForm] = useState(null);
  const [newQuiz, setNewQuiz] = useState({
    id: null,
    titre: "",
    description: "",
    idCours: "",
    duree: 30,
    nbQuestions: 1,
    type: "quiz",
    actif: true,
    questions: []
  });

  const [newEvaluationPDF, setNewEvaluationPDF] = useState({
    id: null,
    titre: "",
    description: "",
    idCours: "",
    dateLimite: "",
    fichierEvaluation: null,
    actif: true
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

  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  useEffect(() => {
    fetchQuizzes();
    fetchEvaluationsPDF();
    fetchCourses();
  }, []);

  // Fonction pour récupérer les résultats d'un quiz
const fetchQuizResults = async (quizId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/quiz/teacher/quizzes/${quizId}/results`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Erreur lors de la récupération des résultats');
    const data = await response.json();
    
    const mappedResults = data.map(result => ({
      idResultat: result.idResultat,
      nom: result.nom,
      prenom: result.prenom,
      email: result.email,
      note: result.note,
      tempsUtilise: result.tempsUtilise,
      date: result.dateSoumission || result.created_at
    }));
    
    setQuizResults(mappedResults);
  } catch (error) {
    console.error(error);
    showNotification("error", "Erreur lors du chargement des résultats");
  }
};

  // ==================== FONCTIONS COMMUNES ====================
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cours/', {
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

  // ==================== FONCTIONS QUIZ ====================
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz/teacher/quizzes', {
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
        type: q.type,
        actif: q.actif,
        nomCours: q.nomCours,
        created_at: q.created_at,
        nombreSoumissions: q.nombreSoumissions || 0,
        moyenneNotes: q.moyenneNotes || 0
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
      const response = await fetch(`http://localhost:5000/api/quiz/teacher/quizzes/${quizId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      debugger;
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
      const data = await response.json();
      
      const quizDetails = {
        quiz: data.quiz,
        questions: data.questions,
        statistiques: data.statistiques
      };
      
      setQuizDetails(quizDetails);

      setActiveForm("detailsQuiz");
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des détails");
    }
  };

  const handleDeleteQuiz = async (id, titre) => {
    if (!window.confirm(`Supprimer le quiz "${titre}" ? Cette action est irréversible.`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/quiz/teacher/quizzes/${id}`, {
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

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    if (!newQuiz.titre || !newQuiz.idCours || newQuiz.questions.length === 0) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires et ajouter au moins une question !");
      return;
    }

    try {
      const quizData = {
        titre: newQuiz.titre,
        description: newQuiz.description,
        idCours: newQuiz.idCours,
        duree: newQuiz.duree,
        nbQuestions: newQuiz.nbQuestions,
        type: newQuiz.type
      };
      
      const response = await fetch("http://localhost:5000/api/quiz/teacher/quizzes", {
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

      const quizId = data.idQuiz;

      // Ajouter les questions une par une
      for (const [index, question] of newQuiz.questions.entries()) {
        await fetch(`http://localhost:5000/api/quiz/teacher/quizzes/${quizId}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            enonce: question.enonce,
            type: question.type,
            ordre: index,
            reponses: question.reponses
          }),
        });
      }

      showNotification("success", "Quiz créé avec succès !");
      resetQuizForm();
      setActiveForm(null);
      fetchQuizzes();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    if (!newQuiz.titre || !newQuiz.idCours) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      const updatedData = {
        titre: newQuiz.titre,
        description: newQuiz.description,
        duree: newQuiz.duree,
        nbQuestions: newQuiz.nbQuestions,
        type: newQuiz.type,
        actif: newQuiz.actif
      };

      const response = await fetch(`http://localhost:5000/api/quiz/teacher/quizzes/${newQuiz.id}`, {
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

      showNotification("success", "Quiz modifié avec succès !");
      resetQuizForm();
      setActiveForm(null);
      fetchQuizzes();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  // ==================== FONCTIONS GESTION DES QUESTIONS ====================
const handleQuestionChange = (e) => {
  const { name, value } = e.target;
  
  if (name === "type") {
    // Réinitialiser les réponses selon le nouveau type
    let newReponses;
    
    if (value === "vrai_faux") {
      newReponses = [
        { reponse: "Vrai", correct: false },
        { reponse: "Faux", correct: false }
      ];
    } else {
      newReponses = [
        { reponse: "", correct: false },
        { reponse: "", correct: false },
        { reponse: "", correct: false },
        { reponse: "", correct: false }
      ];
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
      reponses: newReponses
    });
  } else {
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  }
};

  const handleAnswerChange = (index, field, value) => {
    const newReponses = [...currentQuestion.reponses];
    
    if (field === 'correct') {
      if (currentQuestion.type === 'choix_multiple') {
        newReponses.forEach((rep, i) => {
          newReponses[i] = { ...rep, correct: i === index };
        });
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

    let questionToAdd = { ...currentQuestion };
    if (currentQuestion.type === 'vrai_faux') {
      questionToAdd.reponses = [
        { reponse: "Vrai", correct: currentQuestion.reponses[0]?.correct || false },
        { reponse: "Faux", correct: currentQuestion.reponses[1]?.correct || false }
      ];
    }

    const hasCorrectAnswer = questionToAdd.reponses.some(r => r.correct && r.reponse.trim());
    if (!hasCorrectAnswer) {
      showNotification("error", "Veuillez sélectionner au moins une réponse correcte");
      return;
    }

    const allAnswersFilled = currentQuestion.type === 'vrai_faux' ? 
      true :
      questionToAdd.reponses.every(r => r.reponse.trim() !== '');
  
    if (!allAnswersFilled) {
      showNotification("error", "Veuillez remplir toutes les réponses");
      return;
    }

    const currentForm = activeForm.includes("Quiz") ? newQuiz : newEvaluationPDF;
    const setForm = activeForm.includes("Quiz") ? setNewQuiz : setNewEvaluationPDF;

    const newQuestions = [...currentForm.questions, {
      ...questionToAdd,
      ordre: currentForm.questions.length
    }];

    setForm({
      ...currentForm,
      questions: newQuestions
    });

    setCurrentQuestion({
      enonce: "",
      type: currentQuestion.type,
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
    const currentForm = activeForm.includes("Quiz") ? newQuiz : newEvaluationPDF;
    const setForm = activeForm.includes("Quiz") ? setNewQuiz : setNewEvaluationPDF;

    const newQuestions = currentForm.questions.filter((_, i) => i !== index);
    setForm({
      ...currentForm,
      questions: newQuestions
    });
    showNotification("success", "Question supprimée !");
  };

  const handleNbQuestionsChange = (value, isQuiz = true) => {
    const nbQuestions = parseInt(value) || 1;
    if (isQuiz) {
      setNewQuiz({
        ...newQuiz,
        nbQuestions: Math.max(1, nbQuestions)
      });
    } else {
      setNewEvaluationPDF({
        ...newEvaluationPDF,
        nbQuestions: Math.max(1, nbQuestions)
      });
    }
  };

  const getProgressPercentage = (isQuiz = true) => {
    const currentForm = isQuiz ? newQuiz : newEvaluationPDF;
    if (currentForm.nbQuestions === 0) return 0;
    return Math.min(100, Math.round((currentForm.questions.length / currentForm.nbQuestions) * 100));
  };

  const isQuestionsComplete = (isQuiz = true) => {
    const currentForm = isQuiz ? newQuiz : newEvaluationPDF;
    return currentForm.questions.length >= currentForm.nbQuestions;
  };

  // ==================== FONCTIONS ÉVALUATIONS PDF ====================
  const fetchEvaluationsPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/evaluation/pdf/teacher/all', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des évaluations PDF');
      const data = await response.json();
      
      const mappedEvaluations = data.map(e => ({
        id: e.idEvaluation,
        titre: e.titre,
        description: e.description,
        dateLimite: e.dateLimite,
        fichierEvaluation: e.fichierEvaluation,
        nomCours: e.nomCours,
        totalEtudiants: e.totalEtudiants || 0,
        actif: e.actif,
        created_at: e.created_at,
        updated_at: e.updated_at
      }));
      
      setEvaluationsPDF(mappedEvaluations);
      setEvaluationPDFLoading(false);
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des évaluations PDF");
      setEvaluationPDFLoading(false);
    }
  };

  const fetchEvaluationPDFDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/evaluation/pdf/teacher/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
      const data = await response.json();
      
      setEvaluationPDFDetails(data);
      setActiveForm("detailsEvaluationPDF");
    } catch (error) {
      console.error(error);
      showNotification("error", "Erreur lors du chargement des détails");
    }
  };

  const handleEvaluationPDFSubmit = async (e) => {
    e.preventDefault();

    if (!newEvaluationPDF.titre || !newEvaluationPDF.idCours || !newEvaluationPDF.dateLimite || !newEvaluationPDF.fichierEvaluation) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires et sélectionner un fichier !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titre', newEvaluationPDF.titre);
      formData.append('description', newEvaluationPDF.description);
      formData.append('idCours', newEvaluationPDF.idCours);
      formData.append('dateLimite', newEvaluationPDF.dateLimite);
      formData.append('fichier', newEvaluationPDF.fichierEvaluation);

      const response = await fetch("http://localhost:5000/api/evaluation/pdf/", {
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

      showNotification("success", "Évaluation PDF créée avec succès !");
      resetEvaluationPDFForm();
      setActiveForm(null);
      fetchEvaluationsPDF();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleUpdateEvaluationPDF = async (e) => {
    e.preventDefault();

    if (!newEvaluationPDF.titre || !newEvaluationPDF.idCours || !newEvaluationPDF.dateLimite) {
      showNotification("error", "Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titre', newEvaluationPDF.titre);
      formData.append('description', newEvaluationPDF.description);
      formData.append('idCours', newEvaluationPDF.idCours);
      formData.append('dateLimite', newEvaluationPDF.dateLimite);
      formData.append('actif', newEvaluationPDF.actif);
      
      if (newEvaluationPDF.fichierEvaluation) {
        formData.append('fichier', newEvaluationPDF.fichierEvaluation);
      }

      const response = await fetch(`http://localhost:5000/api/evaluation/pdf/teacher/${newEvaluationPDF.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        showNotification("error", data.message || "Erreur lors de la mise à jour de l'évaluation !");
        return;
      }

      showNotification("success", "Évaluation modifiée avec succès !");
      resetEvaluationPDFForm();
      setActiveForm(null);
      fetchEvaluationsPDF();
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleDeleteEvaluationPDF = async (id, titre) => {
    if (!window.confirm(`Supprimer l'évaluation "${titre}" ? Cette action est irréversible.`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/evaluation/pdf/teacher/${id}`, {
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

      setEvaluationsPDF(evaluationsPDF.filter((e) => e.id !== id));
      showNotification("success", "Évaluation supprimée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const toggleEvaluationPDFStatus = async (evaluation) => {
    try {
      const formData = new FormData();
      formData.append('titre', evaluation.titre);
      formData.append('description', evaluation.description);
      formData.append('actif', !evaluation.actif);

      const response = await fetch(`http://localhost:5000/api/evaluation/pdf/teacher/${evaluation.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        showNotification("error", errorData.message || "Erreur lors du changement de statut !");
        return;
      }

      const updatedEvaluations = evaluationsPDF.map((e) =>
        e.id === evaluation.id ? { ...e, actif: !e.actif } : e
      );

      setEvaluationsPDF(updatedEvaluations);
      showNotification("success", `Évaluation ${!evaluation.actif ? 'activée' : 'désactivée'} avec succès !`);
    } catch (error) {
      console.error("Erreur:", error);
      showNotification("error", "Erreur réseau ou serveur !");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        showNotification("error", "Veuillez sélectionner un fichier PDF valide");
        return;
      }

      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification("error", "Le fichier est trop volumineux (max 10MB)");
        return;
      }

      setNewEvaluationPDF({
        ...newEvaluationPDF,
        fichierEvaluation: file
      });
    }
  };

  const downloadEvaluationFile = (evaluation) => {
    const fileUrl = `http://localhost:5000/uploads/evaluations/${evaluation.fichierEvaluation}`;
    window.open(fileUrl, '_blank');
  };

  // ==================== FONCTIONS DE RÉINITIALISATION ====================
  const resetQuizForm = () => {
    setNewQuiz({
      id: null,
      titre: "",
      description: "",
      idCours: "",
      duree: 30,
      nbQuestions: 1,
      type: "quiz",
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

  const resetEvaluationPDFForm = () => {
    setNewEvaluationPDF({
      id: null,
      titre: "",
      description: "",
      idCours: "",
      dateLimite: "",
      fichierEvaluation: null,
      actif: true
    });
    setFileUploadProgress(0);
  };

  // ==================== FILTRAGE ====================
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.titre.toLowerCase().includes(quizSearch.toLowerCase()) ||
    quiz.nomCours?.toLowerCase().includes(quizSearch.toLowerCase())
  );

  const filteredEvaluationsPDF = evaluationsPDF.filter((evaluation) =>
    evaluation.titre.toLowerCase().includes(evaluationPDFSearch.toLowerCase()) ||
    evaluation.nomCours?.toLowerCase().includes(evaluationPDFSearch.toLowerCase())
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
              <div className="d-flex justify-content-between align-items-center mb-4">
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
                      <th>Soumissions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizLoading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
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
                          <td>{q.nombreSoumissions}</td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-info btn-sm me-1"
                                onClick={() => fetchQuizDetails(q.id)}
                                title="Voir détails"
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteQuiz(q.id, q.titre)}
                                title="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted py-4">
                          {quizzes.length === 0 ? "Aucun quiz créé pour le moment" : "Aucun quiz trouvé"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section Évaluations PDF */}
          <div className="card-modern">
            <div className="card-header" style={{ borderBottom: '2px solid #dee2e6', backgroundColor: 'transparent' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">
                  <FaFilePdf className="me-2" /> Gestion des Évaluations PDF
                </h4>
                <button
                  className="btn"
                  style={{ backgroundColor: "#28a745", color: "#fff" }}
                  onClick={() => setActiveForm("ajouterEvaluationPDF")}
                >
                  <FaPlus /> Créer une Évaluation PDF
                </button>
              </div>
              
              {/* Recherche Évaluations PDF */}
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
                      value={evaluationPDFSearch}
                      onChange={(e) => setEvaluationPDFSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tableau Évaluations PDF */}
              <div className="table-responsive">
                <table className="table table-modern align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Titre</th>
                      <th>Description</th>
                      <th>Fichier</th>
                      <th>Date limite</th>
                      <th>Cours</th>
                      <th>Étudiants</th>
                      <th>Créée le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationPDFLoading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          <div className="spinner-border text-success"></div>
                        </td>
                      </tr>
                    ) : filteredEvaluationsPDF.length > 0 ? (
                      filteredEvaluationsPDF.map((e) => (
                        <tr key={e.id}>
                          <td><strong>{e.titre}</strong></td>
                          <td>{e.description || "—"}</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => downloadEvaluationFile(e)}
                              title="Télécharger le fichier"
                            >
                              <FaDownload className="me-1" />
                              PDF
                            </button>
                          </td>
                          <td>
                            <FaCalendarAlt className="me-1" />
                            {new Date(e.dateLimite).toLocaleDateString('fr-FR')}
                          </td>
                          <td>{e.nomCours || "—"}</td>
                          <td>
                            <FaUsers className="me-1" />
                            {e.totalEtudiants}
                          </td>
                          <td>
                            {new Date(e.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-info btn-sm me-1"
                                onClick={() => fetchEvaluationPDFDetails(e.id)}
                                title="Voir détails"
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteEvaluationPDF(e.id, e.titre)}
                                title="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted py-4">
                          {evaluationsPDF.length === 0 ? "Aucune évaluation PDF créée pour le moment" : "Aucune évaluation trouvée"}
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

      {/* ==================== FORMULAIRES ET DÉTAILS ÉVALUATIONS PDF ==================== */}

      {/* Détails Évaluation PDF */}
      {activeForm === "detailsEvaluationPDF" && evaluationPDFDetails && (
        <div className="card-modern p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Détails de l'Évaluation: {evaluationPDFDetails.titre}</h4>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setActiveForm(null);
                setEvaluationPDFDetails(null);
              }}
            >
              ← Retour
            </button>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Description:</strong> {evaluationPDFDetails.description || "—"}</p>
              <p><strong>Cours:</strong> {evaluationPDFDetails.nomCours || "—"}</p>
              <p><strong>Fichier:</strong> {evaluationPDFDetails.fichierEvaluation}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Date limite:</strong> 
                <FaCalendarAlt className="me-2 ms-2" />
                {new Date(evaluationPDFDetails.dateLimite).toLocaleDateString('fr-FR')}
              </p>
              <p><strong>Étudiants inscrits:</strong> 
                <FaUsers className="me-2 ms-2" />
                {evaluationPDFDetails.totalEtudiants || 0}
              </p>
              <p><strong>Statut:</strong> 
                <span className={`badge ${evaluationPDFDetails.actif ? 'bg-success' : 'bg-secondary'} ms-2`}>
                  {evaluationPDFDetails.actif ? 'Actif' : 'Inactif'}
                </span>
              </p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => downloadEvaluationFile(evaluationPDFDetails)}
            >
              <FaDownload className="me-2" />
              Télécharger le PDF
            </button>
            <button
              className="btn btn-warning"
              onClick={() => {
                setNewEvaluationPDF({
                  id: evaluationPDFDetails.idEvaluation,
                  titre: evaluationPDFDetails.titre,
                  description: evaluationPDFDetails.description,
                  idCours: evaluationPDFDetails.idCours,
                  dateLimite: evaluationPDFDetails.dateLimite.split('T')[0],
                  fichierEvaluation: null,
                  actif: evaluationPDFDetails.actif
                });
                setActiveForm("modifierEvaluationPDF");
              }}
            >
              <FaEdit className="me-2" />
              Modifier l'évaluation
            </button>
          </div>
        </div>
      )}

      {/* Formulaire Évaluation PDF */}
      {(activeForm === "ajouterEvaluationPDF" || activeForm === "modifierEvaluationPDF") && (
        <div className="card-modern p-4">
          <h4>{activeForm === "modifierEvaluationPDF" ? "Modifier l'évaluation PDF" : "Créer une nouvelle évaluation PDF"}</h4>
          <form onSubmit={activeForm === "modifierEvaluationPDF" ? handleUpdateEvaluationPDF : handleEvaluationPDFSubmit}>
            
            {/* Titre */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Titre *</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={newEvaluationPDF.titre}
                  onChange={(e) => setNewEvaluationPDF({ ...newEvaluationPDF, titre: e.target.value })}
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
                  value={newEvaluationPDF.description}
                  onChange={(e) => setNewEvaluationPDF({ ...newEvaluationPDF, description: e.target.value })}
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
                  value={newEvaluationPDF.idCours}
                  onChange={(e) => setNewEvaluationPDF({ ...newEvaluationPDF, idCours: e.target.value })}
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
              <label className="col-sm-2 col-form-label">Date limite *</label>
              <div className="col-sm-10">
                <input
                  type="date"
                  className="form-control"
                  value={newEvaluationPDF.dateLimite}
                  onChange={(e) => setNewEvaluationPDF({ ...newEvaluationPDF, dateLimite: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <small className="text-muted">
                  Date limite de soumission pour les étudiants
                </small>
              </div>
            </div>

            {/* Upload de fichier */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">
                Fichier PDF {activeForm === "ajouterEvaluationPDF" ? "*" : ""}
              </label>
              <div className="col-sm-10">
                <div className="file-upload-area">
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    required={activeForm === "ajouterEvaluationPDF"}
                  />
                  <small className="text-muted">
                    Formats acceptés: PDF (max 10MB)
                  </small>
                  
                  {newEvaluationPDF.fichierEvaluation && (
                    <div className="mt-2 p-2 border rounded bg-light">
                      <div className="d-flex align-items-center">
                        <FaFile className="me-2 text-primary" />
                        <span className="flex-grow-1">
                          {newEvaluationPDF.fichierEvaluation.name || newEvaluationPDF.fichierEvaluation}
                        </span>
                        <span className="badge bg-info">
                          {(newEvaluationPDF.fichierEvaluation.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Aperçu de la progression d'upload */}
                  {fileUploadProgress > 0 && fileUploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="progress">
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          style={{ width: `${fileUploadProgress}%` }}
                        >
                          {fileUploadProgress}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statut (uniquement en modification) */}
            {activeForm === "modifierEvaluationPDF" && (
              <div className="row mb-3 align-items-center">
                <label className="col-sm-2 col-form-label">Statut</label>
                <div className="col-sm-10">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={newEvaluationPDF.actif}
                      onChange={(e) => setNewEvaluationPDF({ ...newEvaluationPDF, actif: e.target.checked })}
                    />
                    <label className="form-check-label">
                      {newEvaluationPDF.actif ? 'Évaluation active' : 'Évaluation désactivée'}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Informations importantes */}
            <div className="alert alert-info">
              <FaExclamationCircle className="me-2" />
              <strong>Information importante:</strong> Les étudiants pourront télécharger ce fichier PDF 
              et devront le soumettre avant la date limite spécifiée.
            </div>

            {/* Boutons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetEvaluationPDFForm();
                  setActiveForm(null);
                }}
              >
                ← Retour
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={!newEvaluationPDF.titre || !newEvaluationPDF.idCours || !newEvaluationPDF.dateLimite || (activeForm === "ajouterEvaluationPDF" && !newEvaluationPDF.fichierEvaluation)}
              >
                <FaUpload className="me-2" />
                {activeForm === "modifierEvaluationPDF" ? "Mettre à jour l'évaluation" : "Créer l'évaluation"}
              </button>
            </div>
          </form>
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
                  onChange={(e) => handleNbQuestionsChange(e.target.value, true)}
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
                    <span className={`badge ${isQuestionsComplete(true) ? 'bg-success' : 'bg-warning'}`}>
                      {isQuestionsComplete(true) ? 'Complet' : 'En cours'}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div 
                      className={`progress-bar ${isQuestionsComplete(true) ? 'bg-success' : 'bg-primary'}`}
                      style={{ width: `${getProgressPercentage(true)}%` }}
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
              {!isQuestionsComplete(true) && (
                <div className="alert alert-warning d-flex align-items-center">
                  <FaExclamationCircle className="me-2" />
                  <div>
                    <strong>Attention:</strong> Vous devez ajouter {newQuiz.nbQuestions - newQuiz.questions.length} question(s) supplémentaire(s) pour compléter le quiz.
                  </div>
                </div>
              )}

              {/* Message de succès si le nombre de questions est atteint */}
              {isQuestionsComplete(true) && (
                <div className="alert alert-success d-flex align-items-center">
                  <FaCheckCircle className="me-2" />
                  <div>
                    <strong>Parfait!</strong> Vous avez ajouté toutes les questions nécessaires. Vous pouvez maintenant créer le quiz.
                  </div>
                </div>
              )}

              {/* Formulaire d'ajout de question (uniquement si pas complet) */}
              {!isQuestionsComplete(true) && (
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
                                <strong>Type:</strong> {question.type}
                                <br />
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
                disabled={!isQuestionsComplete(true) || newQuiz.questions.length === 0}
              >
                {activeForm === "modifierQuiz" ? "Mettre à jour le quiz" : "Créer le quiz"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeForm === "detailsQuiz" && quizDetails && (
  <div className="card-modern p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>Détails du Quiz: {quizDetails.quiz.titre}</h4>
      <button
        className="btn btn-secondary"
        onClick={() => {
          setActiveForm(null);
          setQuizDetails(null);
          setQuizResults([]);
        }}
      >
        ← Retour
      </button>
    </div>
    
    {/* Informations générales du quiz */}
    <div className="row mb-4">
      <div className="col-md-6">
        <div className="info-card">
          <h6 className="info-title">Informations générales</h6>
          <div className="info-content">
            <p><strong>Description:</strong> {quizDetails.quiz.description || "—"}</p>
            <p><strong>Cours:</strong> {quizDetails.quiz.nomCours || "—"}</p>
            <p><strong>Type:</strong> 
              <span className="badge bg-info ms-2 text-capitalize">
                {quizDetails.quiz.type}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="info-card">
          <h6 className="info-title">Paramètres</h6>
          <div className="info-content">
            <p>
              <FaClock className="me-2 text-muted" />
              <strong>Durée:</strong> {quizDetails.quiz.duree} minutes
            </p>
            <p>
              <FaListAlt className="me-2 text-muted" />
              <strong>Nombre de questions:</strong> {quizDetails.quiz.nbQuestions}
            </p>
            <p><strong>Statut:</strong> 
              <span className={`badge ${quizDetails.quiz.actif ? 'bg-success' : 'bg-secondary'} ms-2`}>
                {quizDetails.quiz.actif ? 'Actif' : 'Inactif'}
              </span>
            </p>
            <p>
              <FaCalendarAlt className="me-2 text-muted" />
              <strong>Créé le:</strong> {new Date(quizDetails.quiz.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Statistiques */}
    {quizDetails.statistiques && (
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">
            <FaChartBar className="me-2" />
            Statistiques du Quiz
          </h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h6 className="stat-title">Soumissions</h6>
                  <p className="stat-value">{quizDetails.statistiques.totalSoumissions || 0}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <div className="stat-content">
                  <h6 className="stat-title">Moyenne</h6>
                  <p className="stat-value">
                    {quizDetails.statistiques.moyenne ? `${quizDetails.statistiques.moyenne.toFixed(1)}%` : "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <FaTrophy />
                </div>
                <div className="stat-content">
                  <h6 className="stat-title">Meilleure note</h6>
                  <p className="stat-value">
                    {quizDetails.statistiques.meilleureNote ? `${quizDetails.statistiques.meilleureNote}%` : "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="stat-card text-center">
                <div className="stat-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="stat-content">
                  <h6 className="stat-title">Pire note</h6>
                  <p className="stat-value">
                    {quizDetails.statistiques.pireNote ? `${quizDetails.statistiques.pireNote}%` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Liste des questions */}
    <div className="questions-section mb-4">
      <h5 className="mb-3">
        <FaListAlt className="me-2" />
        Questions ({quizDetails.questions.length})
      </h5>
      
      {quizDetails.questions.length > 0 ? (
        <div className="questions-list">
          {quizDetails.questions.map((question, index) => (
            <div key={question.idQuestion} className="question-card card mb-3">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    Question {index + 1}
                    <span className="badge bg-secondary ms-2 text-capitalize">
                      {question.type}
                    </span>
                  </h6>
                  <span className="text-muted small">
                    Ordre: {question.ordre + 1}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="question-enonce">{question.enonce}</p>
                
                <div className="answers-section mt-3">
                  <h6 className="answers-title">Réponses:</h6>
                  <div className="answers-list">
                    {question.reponses && JSON.parse(question.reponses).map((reponse, repIndex) => (
                      <div 
                        key={repIndex} 
                        className={`answer-item ${reponse.correct ? 'correct-answer' : 'incorrect-answer'}`}
                      >
                        <div className="d-flex align-items-center">
                          <span className="answer-number me-2">{repIndex + 1}.</span>
                          <span className="answer-text flex-grow-1">{reponse.reponse}</span>
                          {reponse.correct && (
                            <span className="correct-badge">
                              <FaCheckCircle className="text-success me-1" />
                              Correcte
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <FaExclamationCircle className="me-2" />
          Aucune question n'a été ajoutée à ce quiz.
        </div>
      )}
    </div>

    {/* Résultats des étudiants */}
    {quizResults.length > 0 && (
      <div className="results-section">
        <h5 className="mb-3">
          <FaUserGraduate className="me-2" />
          Résultats des étudiants ({quizResults.length})
        </h5>
        
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Étudiant</th>
                <th>Email</th>
                <th>Note</th>
                <th>Temps utilisé</th>
                <th>Date de soumission</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map(result => (
                <tr key={result.idResultat}>
                  <td>
                    <strong>{result.prenom} {result.nom}</strong>
                  </td>
                  <td>{result.email}</td>
                  <td>
                    <span className={`badge ${result.note >= 50 ? 'bg-success' : 'bg-danger'}`}>
                      {Math.round(result.note)}%
                    </span>
                  </td>
                  <td>
                    {result.tempsUtilise ? (
                      <span className="text-muted">
                        {Math.floor(result.tempsUtilise / 60)}m {result.tempsUtilise % 60}s
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {new Date(result.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span className={`badge ${
                      result.note >= 80 ? 'bg-success' : 
                      result.note >= 50 ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {result.note >= 80 ? 'Excellent' : 
                       result.note >= 50 ? 'Satisfaisant' : 'Insuffisant'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Résumé des résultats */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title">Moyenne générale</h6>
                <p className="card-text h4 text-primary">
                  {quizResults.reduce((acc, curr) => acc + curr.note, 0) / quizResults.length}%
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title">Taux de réussite</h6>
                <p className="card-text h4 text-success">
                  {Math.round((quizResults.filter(r => r.note >= 50).length / quizResults.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h6 className="card-title">Temps moyen</h6>
                <p className="card-text h4 text-info">
                  {Math.round(quizResults.reduce((acc, curr) => acc + (curr.tempsUtilise || 0), 0) / quizResults.length)}s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Actions */}
    <div className="d-flex justify-content-between mt-4 pt-3 border-top">
      <button
        className="btn btn-outline-secondary"
        onClick={() => {
          setActiveForm(null);
          setQuizDetails(null);
          setQuizResults([]);
        }}
      >
        ← Retour à la liste
      </button>
      
      <div className="btn-group">
        <button
          className="btn btn-warning"
          onClick={() => {
            // Pré-remplir le formulaire de modification
            setNewQuiz({
              id: quizDetails.quiz.idQuiz,
              titre: quizDetails.quiz.titre,
              description: quizDetails.quiz.description,
              idCours: quizDetails.quiz.idCours,
              duree: quizDetails.quiz.duree,
              nbQuestions: quizDetails.quiz.nbQuestions,
              type: quizDetails.quiz.type,
              actif: quizDetails.quiz.actif,
              questions: quizDetails.questions
            });
            setActiveForm("modifierQuiz");
          }}
        >
          <FaEdit className="me-2" />
          Modifier le quiz
        </button>
        
        <button
          className="btn btn-danger"
          onClick={() => handleDeleteQuiz(quizDetails.quiz.idQuiz, quizDetails.quiz.titre)}
        >
          <FaTrash className="me-2" />
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
