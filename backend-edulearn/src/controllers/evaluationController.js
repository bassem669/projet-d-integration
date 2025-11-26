// ==================== ÉVALUATIONS PDF - FONCTIONS ÉTUDIANT ====================
const connection = require('../config/db');
const path = require('path');
const fs = require("fs");


// Obtenir toutes les évaluations PDF disponibles pour un étudiant
exports.getEvaluationsPDFForStudent = (req, res) => {
  const studentId = req.user.id;

  connection.query(
    `SELECT 
       ep.idEvaluation,
       ep.titre,
       ep.description,
       ep.fichierEvaluation,
       ep.dateLimite,
       ep.created_at,
       c.titre as nomCours
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE i.idEtudiant = ? AND ep.actif = TRUE
     ORDER BY ep.created_at DESC`,
    [studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching PDF evaluations:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Obtenir une évaluation PDF spécifique
exports.getEvaluationPDFById = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  connection.query(
    `SELECT 
       ep.*, 
       c.titre as nomCours
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE ep.idEvaluation = ? AND i.idEtudiant = ? AND ep.actif = TRUE`,
    [id, studentId],
    (err, results) => {
      if (err) {
        console.error('Error fetching PDF evaluation:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Évaluation non trouvée ou accès non autorisé' });
      }

      res.json(results[0]);
    }
  );
};

// Télécharger une évaluation PDF
exports.downloadEvaluationPDF = (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  // Vérifier que l'étudiant a accès à cette évaluation
  connection.query(
    `SELECT ep.fichierEvaluation, ep.titre
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     JOIN inscription i ON c.idCours = i.idCours
     WHERE ep.idEvaluation = ? AND i.idEtudiant = ? AND ep.actif = TRUE`,
    [id, studentId],
    (err, results) => {
      if (err) {
        console.error('Error verifying evaluation access:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Évaluation non trouvée ou accès non autorisé' });
      }

      const evaluation = results[0];
      const filePath = path.join(__dirname, '../uploads/evaluations', evaluation.fichierEvaluation);

      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Télécharger le fichier
      res.download(filePath, `${evaluation.titre}.pdf`, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ message: 'Erreur lors du téléchargement' });
        }
      });
    }
  );
};

// ==================== ÉVALUATIONS PDF - FONCTIONS ENSEIGNANT ====================

// Créer une nouvelle évaluation PDF
exports.createEvaluationPDF = (req, res) => {
  const { titre, description, idCours, dateLimite } = req.body;
  const teacherId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier d\'évaluation fourni' });
  }

  const fichierEvaluation = req.file.filename;

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
        `INSERT INTO EvaluationPDF (titre, description, idCours, fichierEvaluation, dateLimite) 
         VALUES (?, ?, ?, ?, ?)`,
        [titre, description, idCours, fichierEvaluation, dateLimite],
        (err, result) => {
          if (err) {
            console.error('Error creating PDF evaluation:', err);
            return res.status(500).json({ message: 'Erreur lors de la création de l\'évaluation' });
          }

          res.status(201).json({
            message: 'Évaluation PDF créée avec succès',
            idEvaluation: result.insertId
          });
        }
      );
    }
  );
};

// Obtenir toutes les évaluations PDF d'un enseignant
exports.getTeacherEvaluationsPDF = (req, res) => {
  const teacherId = req.user.id;

  connection.query(
    `SELECT 
       ep.*, 
       c.titre as nomCours,
       (SELECT COUNT(*) 
        FROM inscription i 
        WHERE i.idCours = c.idCours) as totalEtudiants
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     WHERE c.idUtilisateur = ?
     ORDER BY ep.created_at DESC`,
    [teacherId],
    (err, results) => {
      if (err) {
        console.error('Error fetching teacher PDF evaluations:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

// Obtenir les détails d'une évaluation PDF pour l'enseignant
exports.getEvaluationPDFDetails = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  connection.query(
    `SELECT 
       ep.*, 
       c.titre as nomCours,
       (SELECT COUNT(*) 
        FROM inscription i 
        WHERE i.idCours = c.idCours) as totalEtudiants
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     WHERE ep.idEvaluation = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, results) => {
      if (err) {
        console.error('Error fetching PDF evaluation details:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Évaluation non trouvée' });
      }

      res.json(results[0]);
    }
  );
};

// Modifier une évaluation PDF
exports.updateEvaluationPDF = (req, res) => {
  const { id } = req.params;
  const { titre, description, dateLimite, actif } = req.body;
  const teacherId = req.user.id;

  // Vérifier que l'enseignant est propriétaire de l'évaluation
  connection.query(
    `SELECT ep.idEvaluation 
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     WHERE ep.idEvaluation = ? AND c.idUtilisateur = ?`,
    [id, teacherId],
    (err, evaluationResults) => {
      if (err) {
        console.error('Error verifying evaluation ownership:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (evaluationResults.length === 0) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      // Préparer les champs à mettre à jour
      let updateFields = [];
      let updateValues = [];

      if (titre !== undefined) {
        updateFields.push('titre = ?');
        updateValues.push(titre);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (dateLimite !== undefined) {
        updateFields.push('dateLimite = ?');
        updateValues.push(dateLimite);
      }
      if (actif !== undefined) {
        updateFields.push('actif = ?');
        updateValues.push(actif);
      }

      // Gérer le fichier s'il est fourni
      if (req.file) {
        updateFields.push('fichierEvaluation = ?');
        updateValues.push(req.file.filename);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
      }

      updateValues.push(id);

      connection.query(
        `UPDATE EvaluationPDF 
         SET ${updateFields.join(', ')}
         WHERE idEvaluation = ?`,
        updateValues,
        (err, result) => {
          if (err) {
            console.error('Error updating PDF evaluation:', err);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
          }

          res.json({
            message: 'Évaluation mise à jour avec succès'
          });
        }
      );
    }
  );
};

// Supprimer une évaluation PDF
exports.deleteEvaluationPDF = (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    // Vérifier que l'enseignant est propriétaire de l'évaluation
    connection.query(
      `SELECT ep.fichierEvaluation 
       FROM EvaluationPDF ep
       JOIN Cours c ON ep.idCours = c.idCours
       WHERE ep.idEvaluation = ? AND c.idUtilisateur = ?`,
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
            res.status(403).json({ message: 'Accès non autorisé' });
          });
        }

        // Supprimer l'évaluation
        connection.query(
          `DELETE FROM EvaluationPDF WHERE idEvaluation = ?`,
          [id],
          (err, result) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error deleting evaluation:', err);
                res.status(500).json({ message: 'Erreur lors de la suppression' });
              });
            }

            // Supprimer le fichier physique
            const fichierEvaluation = evaluationResults[0].fichierEvaluation;
            const filePath = path.join(__dirname, '../uploads/evaluations', fichierEvaluation);
            
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  console.error('Commit error:', err);
                  res.status(500).json({ message: 'Erreur serveur' });
                });
              }

              res.json({
                message: 'Évaluation supprimée avec succès'
              });
            });
          }
        );
      }
    );
  });
};

// Statistiques des évaluations PDF pour un enseignant
exports.getTeacherPDFStats = (req, res) => {
  const teacherId = req.user.id;

  connection.query(
    `SELECT 
       COUNT(*) as totalEvaluations,
       COUNT(CASE WHEN actif = TRUE THEN 1 END) as evaluationsActives,
       COUNT(CASE WHEN dateLimite IS NOT NULL AND dateLimite > NOW() THEN 1 END) as evaluationsEnCours,
       COUNT(CASE WHEN dateLimite IS NOT NULL AND dateLimite < NOW() THEN 1 END) as evaluationsExpirees,
       COUNT(DISTINCT idCours) as coursAvecEvaluations
     FROM EvaluationPDF ep
     JOIN Cours c ON ep.idCours = c.idCours
     WHERE c.idUtilisateur = ?`,
    [teacherId],
    (err, results) => {
      if (err) {
        console.error('Error fetching PDF evaluation stats:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      res.json(results[0]);
    }
  );
};