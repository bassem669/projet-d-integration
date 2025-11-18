// controllers/evaluationController.js
const connection = require('./db');

// Obtenir toutes les évaluations (quiz) disponibles pour un étudiant
exports.getEvaluationsForStudent = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT 
       q.idQuiz,
       q.titre,
       q.description,
       q.type,
       q.duree,
       q.nbQuestions,
       q.created_at,
       c.titre as nomCours,
       COUNT(DISTINCT qq.idQuestion) as nombreQuestionsReelles,
       rq.note as noteObtenue,
       rq.date as datePassation
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     LEFT JOIN QuestionQuiz qq ON q.idQuiz = qq.idQuiz
     LEFT JOIN ResultatQuiz rq ON q.idQuiz = rq.idQuiz AND rq.idEtudiant = ?
     WHERE i.idEtudiant = ? AND q.actif = TRUE
     GROUP BY q.idQuiz
     ORDER BY q.created_at DESC`,
    [studentId, studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching evaluations:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Obtenir une évaluation spécifique avec ses questions
exports.getEvaluationById = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  // Vérifier l'accès à l'évaluation
  connection.query(
    `SELECT q.*, c.titre as nomCours 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE q.idQuiz = ? AND i.idEtudiant = ? AND q.actif = TRUE`,
    [id, studentId],
    (err, evaluationResults) => {
      if (err) {
        console.error('Error verifying evaluation access:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (evaluationResults.length === 0) {
        return res.status(404).json({ message: 'Évaluation non trouvée ou accès non autorisé' });
      }

      // Vérifier si l'étudiant a déjà passé cette évaluation
      connection.query(
        `SELECT * FROM ResultatQuiz 
         WHERE idQuiz = ? AND idEtudiant = ?`,
        [id, studentId],
        (err, resultResults) => {
          if (err) {
            console.error('Error checking previous results:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
          }

          // Obtenir les questions avec réponses (sans indiquer les bonnes réponses)
          connection.query(
            `SELECT 
                qq.idQuestion, 
                qq.enonce, 
                qq.type,
                qq.ordre,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'idReponse', rp.idReponse,
                    'reponse', rp.reponse
                  )
                ) as reponses
             FROM QuestionQuiz qq
             LEFT JOIN ReponsePossible rp ON qq.idQuestion = rp.idQuestion
             WHERE qq.idQuiz = ?
             GROUP BY qq.idQuestion
             ORDER BY qq.ordre ASC`,
            [id],
            (err, questionResults) => {
              if (err) {
                console.error('Error fetching questions:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
              }

              res.json({
                evaluation: evaluationResults[0],
                questions: questionResults,
                dejaPasse: resultResults.length > 0,
                resultatPrecedent: resultResults.length > 0 ? resultResults[0] : null
              });
            }
          );
        }
      );
    }
  );
};

// Soumettre une évaluation (quiz)
exports.submitEvaluation = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;
  const { reponses, tempsUtilise } = req.body;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    // Vérifier que l'étudiant n'a pas déjà passé cette évaluation
    connection.query(
      `SELECT * FROM ResultatQuiz 
       WHERE idQuiz = ? AND idEtudiant = ?`,
      [id, studentId],
      (err, existingResults) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error checking existing results:', err);
            res.status(500).json({ message: 'Erreur serveur' });
          });
        }

        if (existingResults.length > 0) {
          return connection.rollback(() => {
            res.status(400).json({ message: 'Vous avez déjà passé cette évaluation' });
          });
        }

        // Obtenir les bonnes réponses
        connection.query(
          `SELECT qq.idQuestion, rp.idReponse
           FROM QuestionQuiz qq
           JOIN ReponsePossible rp ON qq.idQuestion = rp.idQuestion
           WHERE qq.idQuiz = ? AND rp.correct = TRUE`,
          [id],
          (err, correctAnswers) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error fetching correct answers:', err);
                res.status(500).json({ message: 'Erreur serveur' });
              });
            }

            // Calculer le score
            let score = 0;
            const correctAnswersMap = {};
            
            correctAnswers.forEach(ca => {
              correctAnswersMap[ca.idQuestion] = ca.idReponse;
            });

            const totalQuestions = Object.keys(correctAnswersMap).length;
            
            // Vérifier chaque réponse de l'étudiant
            Object.keys(reponses).forEach(questionId => {
              if (correctAnswersMap[questionId] && parseInt(reponses[questionId]) === correctAnswersMap[questionId]) {
                score++;
              }
            });

            const noteFinale = totalQuestions > 0 ? (score / totalQuestions) * 20 : 0;

            // Enregistrer le résultat
            connection.query(
              `INSERT INTO ResultatQuiz (idEtudiant, idQuiz, note, tempsUtilise, date) 
               VALUES (?, ?, ?, ?, CURDATE())`,
              [studentId, id, noteFinale, tempsUtilise],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error('Error saving evaluation result:', err);
                    res.status(500).json({ message: 'Erreur lors de la sauvegarde du résultat' });
                  });
                }

                connection.commit(err => {
                  if (err) {
                    return connection.rollback(() => {
                      console.error('Commit error:', err);
                      res.status(500).json({ message: 'Erreur serveur' });
                    });
                  }

                  res.json({
                    message: 'Évaluation soumise avec succès',
                    score: Math.round(noteFinale * 100) / 100,
                    pointsObtenus: score,
                    totalPoints: totalQuestions,
                    pourcentage: Math.round((score / totalQuestions) * 100)
                  });
                });
              }
            );
          }
        );
      }
    );
  });
};

// Obtenir les résultats d'évaluation d'un étudiant
exports.getStudentEvaluationResults = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT 
       rq.*,
       q.titre as titreEvaluation,
       q.type,
       c.titre as nomCours,
       (SELECT COUNT(*) FROM QuestionQuiz qq WHERE qq.idQuiz = q.idQuiz) as totalQuestions
     FROM ResultatQuiz rq
     JOIN Quiz q ON rq.idQuiz = q.idQuiz
     JOIN Cours c ON q.idCours = c.idCours
     WHERE rq.idEtudiant = ?
     ORDER BY rq.date DESC, rq.created_at DESC`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching evaluation results:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Statistiques d'évaluation pour un étudiant
exports.getEvaluationStats = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT 
       COUNT(DISTINCT rq.idQuiz) as totalEvaluationsPassees,
       COUNT(DISTINCT q.idQuiz) as totalEvaluationsDisponibles,
       AVG(rq.note) as moyenneGenerale,
       MAX(rq.note) as meilleureNote,
       MIN(rq.note) as pireNote,
       COUNT(DISTINCT c.idCours) as coursAvecEvaluations
     FROM ResultatQuiz rq
     JOIN Quiz q ON rq.idQuiz = q.idQuiz
     JOIN Cours c ON q.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE rq.idEtudiant = ? AND i.idEtudiant = ?`,
    [studentId, studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching evaluation stats:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      const stats = results[0];
      
      // Calculer le pourcentage de completion
      const pourcentageCompletion = stats.totalEvaluationsDisponibles > 0 
        ? Math.round((stats.totalEvaluationsPassees / stats.totalEvaluationsDisponibles) * 100)
        : 0;

      res.json({
        ...stats,
        pourcentageCompletion,
        moyenneGenerale: Math.round(stats.moyenneGenerale * 100) / 100 || 0
      });
    }
  );
};

// Obtenir les évaluations par cours
exports.getEvaluationsByCourse = (req, res) => {
  const { coursId } = req.params;
  const studentId = req.user.id;

  connection.query(
    `SELECT 
       q.*,
       rq.note as noteObtenue,
       rq.date as datePassation,
       COUNT(DISTINCT qq.idQuestion) as totalQuestions
     FROM Quiz q
     LEFT JOIN ResultatQuiz rq ON q.idQuiz = rq.idQuiz AND rq.idEtudiant = ?
     LEFT JOIN QuestionQuiz qq ON q.idQuiz = qq.idQuiz
     WHERE q.idCours = ? AND q.actif = TRUE
     GROUP BY q.idQuiz
     ORDER BY q.created_at DESC`,
    [studentId, coursId],
    (err, results) => {
      if (err) {
        console.error('Error fetching course evaluations:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};