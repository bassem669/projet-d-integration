const connection = require('../config/db');

// ==================== FONCTIONS ÉTUDIANT ====================

// Récupérer tous les quiz accessibles pour un étudiant
exports.getQuizForStudent = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT q.*, c.titre as nomCours 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE i.idEtudiant = ? AND q.actif = TRUE
     ORDER BY q.created_at DESC`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching quizzes:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Récupérer un quiz spécifique pour un étudiant
exports.getQuizById = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  // Vérifier que l'étudiant a accès à ce quiz
  connection.query(
    `SELECT q.*, c.titre as nomCours 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE q.idQuiz = ? AND i.idEtudiant = ? AND q.actif = TRUE`,
    [id, studentId],
    (err, quizResults) => {
      if (err) {
        console.error('Error verifying quiz access:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (quizResults.length === 0) {
        return res.status(404).json({ message: 'Quiz non trouvé ou accès non autorisé' });
      }

      // Récupérer les questions avec les réponses possibles (sans l'indicateur de correction)
      connection.query(
        `SELECT qq.idQuestion, qq.enonce, qq.type, qq.ordre,
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
            quiz: quizResults[0],
            questions: questionResults
          });
        }
      );
    }
  );
};

// Soumettre les réponses d'un quiz et calculer le score
exports.submitQuiz = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;
  const { reponses, tempsUtilise } = req.body;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    // Vérifier si l'étudiant a déjà soumis ce quiz
    connection.query(
      `SELECT idResultat FROM ResultatQuiz 
       WHERE idEtudiant = ? AND idQuiz = ?`,
      [studentId, id],
      (err, existingResults) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error checking existing results:', err);
            res.status(500).json({ message: 'Erreur serveur' });
          });
        }

        if (existingResults.length > 0) {
          return connection.rollback(() => {
            res.status(400).json({ message: 'Vous avez déjà soumis ce quiz' });
          });
        }

        // Récupérer les bonnes réponses pour ce quiz
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

            Object.keys(reponses).forEach(questionId => {
              if (correctAnswersMap[questionId] && parseInt(reponses[questionId]) === correctAnswersMap[questionId]) {
                score++;
              }
            });

            const totalQuestions = Object.keys(correctAnswersMap).length;
            const finalScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

            // Sauvegarder le résultat
            connection.query(
              `INSERT INTO ResultatQuiz (idEtudiant, idQuiz, note, tempsUtilise, date) 
               VALUES (?, ?, ?, ?, NOW())`,
              [studentId, id, finalScore, tempsUtilise],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error('Error saving quiz result:', err);
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
                    message: 'Quiz soumis avec succès',
                    score: Math.round(finalScore),
                    correctAnswers: score,
                    totalQuestions: totalQuestions
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

// Récupérer les résultats des quiz d'un étudiant
exports.getQuizResults = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT rq.*, q.idQuiz, q.titre as titreQuiz, c.titre as nomCours
     FROM ResultatQuiz rq
     JOIN Quiz q ON rq.idQuiz = q.idQuiz
     JOIN Cours c ON q.idCours = c.idCours
     WHERE rq.idEtudiant = ?
     ORDER BY rq.date DESC`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching quiz results:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// ==================== FONCTIONS ENSEIGNANT ====================

// Créer un nouveau quiz
exports.createQuiz = (req, res) => {
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
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à créer un quiz pour ce cours' });
      }

      connection.query(
        `INSERT INTO Quiz (titre, description, idCours, duree, nbQuestions, type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [titre, description, idCours, duree, nbQuestions, type],
        (err, result) => {
          if (err) {
            console.error('Error creating quiz:', err);
            return res.status(500).json({ message: 'Erreur lors de la création du quiz' });
          }

          res.status(201).json({
            message: 'Quiz créé avec succès',
            idQuiz: result.insertId
          });
        }
      );
    }
  );
};

// Récupérer tous les quiz d'un enseignant
exports.getTeacherQuizzes = (req, res) => {
  const teacherId = req.user.id;

  connection.query(
    `SELECT q.*, c.titre as nomCours, 
            COUNT(DISTINCT rq.idResultat) as nombreSoumissions,
            AVG(rq.note) as moyenneNotes
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     LEFT JOIN ResultatQuiz rq ON q.idQuiz = rq.idQuiz
     WHERE c.idUtilisateur = ?
     GROUP BY q.idQuiz
     ORDER BY q.created_at DESC`,
    [teacherId],
    (err, results) => {
      if (err) {
        console.error('Error fetching teacher quizzes:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Récupérer un quiz spécifique avec toutes les données pour l'enseignant
exports.getQuizDetailsForTeacher = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  connection.query(
    `SELECT q.*, c.titre as nomCours
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, quizResults) => {
      if (err) {
        console.error('Error fetching quiz details:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (quizResults.length === 0) {
        return res.status(404).json({ message: 'Quiz non trouvé' });
      }

      // Récupérer les questions avec toutes les réponses (y compris l'indicateur de correction)
      connection.query(
        `SELECT qq.idQuestion, qq.enonce, qq.type, qq.ordre,
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
               MIN(note) as pireNote
             FROM ResultatQuiz 
             WHERE idQuiz = ?`,
            [id],
            (err, statsResults) => {
              if (err) {
                console.error('Error fetching stats:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
              }

              res.json({
                quiz: quizResults[0],
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

// Ajouter une question à un quiz
exports.addQuestionToQuiz = (req, res) => {
  const { id } = req.params;
  const { enonce, type, ordre, reponses } = req.body;
  const teacherId = req.user.id;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    // Vérifier que l'enseignant est propriétaire du quiz
    connection.query(
      `SELECT q.idQuiz 
       FROM Quiz q
       JOIN Cours c ON q.idCours = c.idCours
       WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
      [id, teacherId],
      (err, quizResults) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error verifying quiz ownership:', err);
            res.status(500).json({ message: 'Erreur serveur' });
          });
        }

        if (quizResults.length === 0) {
          return connection.rollback(() => {
            res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce quiz' });
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

// Mettre à jour un quiz
exports.updateQuiz = (req, res) => {
  const { id } = req.params;
  const { titre, description, duree, nbQuestions, type, actif } = req.body;
  const teacherId = req.user.id;

  // Vérifier que l'enseignant est propriétaire du quiz
  connection.query(
    `SELECT q.idQuiz 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, quizResults) => {
      if (err) {
        console.error('Error verifying quiz ownership:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (quizResults.length === 0) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce quiz' });
      }

      connection.query(
        `UPDATE Quiz 
         SET titre = ?, description = ?, duree = ?, nbQuestions = ?, type = ?, actif = ?
         WHERE idQuiz = ?`,
        [titre, description, duree, nbQuestions, type, actif, id],
        (err, result) => {
          if (err) {
            console.error('Error updating quiz:', err);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du quiz' });
          }

          res.json({ message: 'Quiz mis à jour avec succès' });
        }
      );
    }
  );
};

// Supprimer un quiz
exports.deleteQuiz = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  // Vérifier que l'enseignant est propriétaire du quiz
  connection.query(
    `SELECT q.idQuiz 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, quizResults) => {
      if (err) {
        console.error('Error verifying quiz ownership:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (quizResults.length === 0) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce quiz' });
      }

      connection.query(
        `DELETE FROM Quiz WHERE idQuiz = ?`,
        [id],
        (err, result) => {
          if (err) {
            console.error('Error deleting quiz:', err);
            return res.status(500).json({ message: 'Erreur lors de la suppression du quiz' });
          }

          res.json({ message: 'Quiz supprimé avec succès' });
        }
      );
    }
  );
};

// Récupérer les résultats détaillés d'un quiz
exports.getQuizResultsDetails = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  // Vérifier que l'enseignant est propriétaire du quiz
  connection.query(
    `SELECT q.idQuiz 
     FROM Quiz q
     JOIN Cours c ON q.idCours = c.idCours
     WHERE q.idQuiz = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, quizResults) => {
      if (err) {
        console.error('Error verifying quiz ownership:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (quizResults.length === 0) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      connection.query(
        `SELECT rq.*, u.nom, u.prenom, u.email
         FROM ResultatQuiz rq
         JOIN Utilisateur u ON rq.idEtudiant = u.idUtilisateur
         WHERE rq.idQuiz = ?
         ORDER BY rq.note DESC`,
        [id],
        (err, results) => {
          if (err) {
            console.error('Error fetching quiz results:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
          }
          res.json(results);
        }
      );
    }
  );
};