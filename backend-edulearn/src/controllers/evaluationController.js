// controllers/evaluationController.js
const connection = require('../config/db');

// ==================== FONCTIONS ÉTUDIANT ====================

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

// ==================== FONCTIONS ENSEIGNANT ====================

// Créer une nouvelle évaluation
exports.createEvaluation = (req, res) => {
  const { titre, description, idCours, duree, nbQuestions, type } = req.body;
  const teacherId = req.user.id;

  // Vérifier que l'enseignant est propriétaire du cours
  connection.query(
    `SELECT idCours FROM Cours WHERE idCours = ? AND idUtilisateur = ?`,
    [idCours, teacherId],
    (err, courseResults) => {
      if (err) {
        console.error('Error verifying course ownership:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (courseResults.length === 0) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à créer une évaluation pour ce cours' });
      }

      connection.query(
        `INSERT INTO Quiz (titre, description, idCours, duree, nbQuestions, type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [titre, description, idCours, duree, nbQuestions, type],
        (err, result) => {
          if (err) {
            console.error('Error creating evaluation:', err);
            return res.status(500).json({ message: 'Erreur lors de la création de l\'évaluation' });
          }

          res.status(201).json({
            message: 'Évaluation créée avec succès',
            idEvaluation: result.insertId
          });
        }
      );
    }
  );
};

// Obtenir toutes les évaluations d'un enseignant
exports.getTeacherEvaluations = (req, res) => {
  const teacherId = req.user.id;

  connection.query(
    `SELECT 
       q.*, 
       c.titre as nomCours,
       COUNT(DISTINCT qq.idQuestion) as nombreQuestions,
       COUNT(DISTINCT rq.idResultat) as nombreSoumissions,
       AVG(rq.note) as moyenneNotes
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     LEFT JOIN QuestionQuiz qq ON q.idQuiz = qq.idQuiz
     LEFT JOIN ResultatQuiz rq ON q.idQuiz = rq.idQuiz
     WHERE c.idUtilisateur = ?
     GROUP BY q.idQuiz
     ORDER BY q.created_at DESC`,
    [teacherId],
    (err, results) => {
      if (err) {
        console.error('Error fetching teacher evaluations:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Obtenir les détails d'une évaluation pour l'enseignant
exports.getEvaluationDetailsForTeacher = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  connection.query(
    `SELECT q.*, c.titre as nomCours
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, evaluationResults) => {
      if (err) {
        console.error('Error fetching evaluation details:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (evaluationResults.length === 0) {
        return res.status(404).json({ message: 'Évaluation non trouvée' });
      }

      // Récupérer les questions avec toutes les réponses
      connection.query(
        `SELECT 
            qq.idQuestion, 
            qq.enonce, 
            qq.type,
            qq.ordre,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'idReponse', rp.idReponse,
                'reponse', rp.reponse,
                'correct', rp.correct
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

          // Récupérer les statistiques des résultats
          connection.query(
            `SELECT 
               COUNT(*) as totalSoumissions,
               AVG(note) as moyenne,
               MAX(note) as meilleureNote,
               MIN(note) as pireNote,
               COUNT(DISTINCT idEtudiant) as etudiantsUniques
             FROM ResultatQuiz 
             WHERE idQuiz = ?`,
            [id],
            (err, statsResults) => {
              if (err) {
                console.error('Error fetching stats:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
              }

              res.json({
                evaluation: evaluationResults[0],
                questions: questionResults,
                statistiques: statsResults[0] || {}
              });
            }
          );
        }
      );
    }
  );
};

// Ajouter une question à une évaluation
exports.addQuestionToEvaluation = (req, res) => {
  const { id } = req.params;
  const { enonce, type, ordre, reponses } = req.body;
  const teacherId = req.user.id;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    // Vérifier que l'enseignant est propriétaire de l'évaluation
    connection.query(
      `SELECT q.idQuiz 
       FROM Quiz q
       JOIN Cours c ON q.idCours = c.idCours
       WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
      [id, teacherId],
      (err, evaluationResults) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error verifying evaluation ownership:', err);
            res.status(500).json({ message: 'Erreur serveur' });
          });
        }

        if (evaluationResults.length === 0) {
          return connection.rollback(() => {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette évaluation' });
          });
        }

        // Ajouter la question
        connection.query(
          `INSERT INTO QuestionQuiz (enonce, type, ordre, idQuiz) 
           VALUES (?, ?, ?, ?)`,
          [enonce, type, ordre, id],
          (err, questionResult) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error adding question:', err);
                res.status(500).json({ message: 'Erreur lors de l\'ajout de la question' });
              });
            }

            const questionId = questionResult.insertId;

            // Ajouter les réponses possibles
            if (reponses && reponses.length > 0) {
              const reponseValues = reponses.map(reponse => 
                [reponse.reponse, reponse.correct, questionId]
              );

              connection.query(
                `INSERT INTO ReponsePossible (reponse, correct, idQuestion) 
                 VALUES ?`,
                [reponseValues],
                (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      console.error('Error adding answers:', err);
                      res.status(500).json({ message: 'Erreur lors de l\'ajout des réponses' });
                    });
                  }

                  connection.commit(err => {
                    if (err) {
                      return connection.rollback(() => {
                        console.error('Commit error:', err);
                        res.status(500).json({ message: 'Erreur serveur' });
                      });
                    }

                    res.status(201).json({
                      message: 'Question ajoutée avec succès',
                      idQuestion: questionId
                    });
                  });
                }
              );
            } else {
              connection.commit(err => {
                if (err) {
                  return connection.rollback(() => {
                    console.error('Commit error:', err);
                    res.status(500).json({ message: 'Erreur serveur' });
                  });
                }

                res.status(201).json({
                  message: 'Question ajoutée avec succès',
                  idQuestion: questionId
                });
              });
            }
          }
        );
      }
    );
  });
};

// Obtenir les résultats détaillés d'une évaluation
exports.getEvaluationResultsDetails = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  // Vérifier que l'enseignant est propriétaire de l'évaluation
  connection.query(
    `SELECT q.idQuiz 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, evaluationResults) => {
      if (err) {
        console.error('Error verifying evaluation ownership:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (evaluationResults.length === 0) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      connection.query(
        `SELECT 
           rq.*, 
           u.nom, 
           u.prenom, 
           u.email,
           (SELECT COUNT(*) FROM QuestionQuiz qq WHERE qq.idQuiz = ?) as totalQuestions
         FROM ResultatQuiz rq
         JOIN Utilisateur u ON rq.idEtudiant = u.idUtilisateur
         WHERE rq.idQuiz = ?
         ORDER BY rq.note DESC`,
        [id, id],
        (err, results) => {
          if (err) {
            console.error('Error fetching evaluation results:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
          }
          res.json(results);
        }
      );
    }
  );
};

// Statistiques globales des évaluations pour un enseignant
exports.getTeacherEvaluationStats = (req, res) => {
  const teacherId = req.user.id;

  connection.query(
    `SELECT 
       COUNT(DISTINCT q.idQuiz) as totalEvaluations,
       COUNT(DISTINCT rq.idResultat) as totalSoumissions,
       COUNT(DISTINCT rq.idEtudiant) as etudiantsUniques,
       AVG(rq.note) as moyenneGenerale,
       COUNT(DISTINCT c.idCours) as coursAvecEvaluations
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     LEFT JOIN ResultatQuiz rq ON q.idQuiz = rq.idQuiz
     WHERE c.idUtilisateur = ?`,
    [teacherId],
    (err, results) => {
      if (err) {
        console.error('Error fetching teacher evaluation stats:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      const stats = results[0];
      
      res.json({
        ...stats,
        moyenneGenerale: Math.round(stats.moyenneGenerale * 100) / 100 || 0
      });
    }
  );
};