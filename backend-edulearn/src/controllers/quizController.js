const connection = require('../config/db');

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

exports.getQuizById = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  // Verify student has access to this quiz
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

      // Get questions with possible answers (without correct flag)
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

// Submit quiz answers and calculate score
exports.submitQuiz = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;
  const { reponses, tempsUtilise } = req.body;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    // Get correct answers for this quiz
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

        // Calculate score
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

        // Save result
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
  });
};

// Get student's quiz results
exports.getQuizResults = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT rq.*, q.titre as titreQuiz, c.titre as nomCours
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