const connection = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

exports.getAllCours = (req, res) => {
  connection.query(
    `SELECT c.*, u.nom AS nomUtilisateur, cl.nomClasse 
     FROM Cours c
     LEFT JOIN Utilisateur u ON c.idUtilisateur = u.idUtilisateur
     LEFT JOIN Classe cl ON c.idClasse = cl.idClasse`,
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des cours :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(results);
    }
  );
};

exports.getCoursByEnseignant = (req, res) => {
  const { idUtilisateur } = req.params;

  // 1. Récupérer tous les cours de l'enseignant
  connection.query(
    `SELECT c.*, u.nom AS nomUtilisateur, cl.nomClasse
     FROM Cours c
     LEFT JOIN Utilisateur u ON c.idUtilisateur = u.idUtilisateur
     LEFT JOIN Classe cl ON c.idClasse = cl.idClasse
     WHERE c.idUtilisateur = ?`,
    [idUtilisateur],
    (err, courses) => {
      if (err) {
        console.error("Erreur lors de la récupération des cours :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (courses.length === 0) return res.json([]); // Pas de cours

      // 2. Récupérer toutes les ressources pour ces cours
      const courseIds = courses.map(c => c.idCours);
      connection.query(
        `SELECT id, courseId, type, url, filePath
         FROM Resources
         WHERE courseId IN (?)`,
        [courseIds],
        (err2, resources) => {
          if (err2) {
            console.error("Erreur lors de la récupération des ressources :", err2);
            return res.status(500).json({ message: "Erreur serveur" });
          }

          // 3. Ajouter les ressources à chaque cours
          const coursesWithResources = courses.map(course => {
            course.resources = resources.filter(r => r.courseId === course.idCours);
            return course;
          });

          res.json(coursesWithResources);
        }
      );
    }
  );
};


// routes/etudiants.js ou routes/enseignants.js

exports.getEtudiantsByEnseignant = (req, res) => {
  const { idEnseignant } = req.params;

  const query = `
    SELECT DISTINCT
        e.idUtilisateur AS idEtudiant,
        e.nom,
        e.prenom,
        e.email,
        e.phone AS telephone,
        c.idCours,
        c.titre AS nomCours,
        ens.nom AS nomEnseignant,
        ens.prenom AS prenomEnseignant
    FROM Utilisateur e
    INNER JOIN Inscription i ON e.idUtilisateur = i.idEtudiant
    INNER JOIN Cours c ON i.idCours = c.idCours
    INNER JOIN Utilisateur ens ON c.idUtilisateur = ens.idUtilisateur
    WHERE c.idUtilisateur = ? 
    ORDER BY e.nom, e.prenom, c.titre;
      `;

  connection.query(query, [idEnseignant], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des étudiants:", err);
      return res.status(500).json({ 
        message: "Erreur serveur lors de la récupération des étudiants",
        error: err.message 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        message: "Aucun étudiant trouvé pour les cours de cet enseignant"  
      });
    }

    // Structurer les données par étudiant avec leurs cours
    const etudiantsStructures = {};

    results.forEach(row => {
      const etudiantId = row.idEtudiant;
      
      if (!etudiantsStructures[etudiantId]) {
        etudiantsStructures[etudiantId] = {
          idEtudiant: row.idEtudiant,
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          telephone: row.telephone,
          enseignant: `${row.prenomEnseignant} ${row.nomEnseignant}`,
          cours: []
        };
      }

      etudiantsStructures[etudiantId].cours.push({
        idCours: row.idCours,
        nomCours: row.nomCours
      });
    });

    const etudiants = Object.values(etudiantsStructures);

    res.json({
      success: true,
      count: etudiants.length,
      enseignant: results[0] ? `${results[0].prenomEnseignant} ${results[0].nomEnseignant}` : '',
      etudiants: etudiants
    });
  });
};


exports.createCours = (req, res) => {
  const { titre, description, DateCours, idClasse, idUtilisateur } = req.body;

  connection.query(
    'INSERT INTO Cours (titre, description, DateCours, idClasse, idUtilisateur) VALUES (?, ?, ?, ?, ?)',
    [titre, description, DateCours, idClasse, idUtilisateur],
    (err, result) => {
      if (err) {
        console.error('Erreur SQL:', err);
        return res.status(500).json({ message: 'Erreur lors de l’ajout du cours' });
      }
      res.status(201).json({ 
        message: 'Cours ajouté avec succès',
        idCours: result.insertId     // 👍 important pour le frontend
      });
    }
  );
};



exports.getCoursById = (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT c.*, u.nom AS nomUtilisateur, cl.nomClasse 
     FROM Cours c
     LEFT JOIN Utilisateur u ON c.idUtilisateur = u.idUtilisateur
     LEFT JOIN Classe cl ON c.idClasse = cl.idClasse
     WHERE c.idCours = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (results.length === 0) return res.status(404).json({ message: 'Cours introuvable' });
      res.json(results[0]);
    }
  );
};

exports.updateCours = (req, res) => {
  const { id } = req.params;
  const { titre, description, DateCours, idClasse } = req.body;

  // récupérer l'ancien support dans la base
      // mise à jour en DB
  connection.query(
    'UPDATE Cours SET titre=?, description=?, DateCours=?, idClasse=? WHERE idCours=?',
    [titre, description, DateCours, idClasse, id],
    (errUpdate) => {
      if (errUpdate)
        return res.status(500).json({ message: 'Erreur lors de la mise à jour' });

      res.json({ message: 'Cours mis à jour avec succès' });
    }
  );


};


exports.deleteCours = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Cours WHERE idCours = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la suppression' });
    res.json({ message: 'Cours supprimé avec succès' });
  });
};

exports.downloadCours = (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT support FROM Cours WHERE idCours = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Erreur base de données:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      if (results.length === 0 || !results[0].support) {
        return res.status(404).json({ message: 'Fichier non trouvé dans la base' });
      }

      const filename = results[0].support;
      
      const filePath = path.join(process.cwd(), 'uploads', filename);
      
      console.log('🔍Recherche fichier:', filePath); 

      if (!fs.existsSync(filePath)) {
        console.error(' Fichier introuvable:', filePath);
        return res.status(404).json({ message: 'Fichier introuvable sur le serveur' });
      }

      // Définir le type de contenu
      const ext = path.extname(filename).toLowerCase();
      const contentTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.mp4': 'video/mp4'
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      
      // Forcer le téléchargement avec le nom original
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Stream du fichier
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        console.error('Erreur streaming:', err);
        res.status(500).json({ message: 'Erreur lors du téléchargement' });
      });
    }
  );
};
exports.getCoursDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Fonction utilitaire pour exécuter les requêtes
    const query = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    // Exécuter les deux requêtes en parallèle
    const [coursResults, ressourcesResults] = await Promise.all([
      query(
        `SELECT 
           c.idCours,
           c.titre,
           c.description,
           c.support,
           c.DateCours,
           c.created_at,
           c.updated_at,
           u.nom AS nomEnseignant, 
           u.prenom AS prenomEnseignant
         FROM Cours c
         LEFT JOIN Utilisateur u ON c.idUtilisateur = u.idUtilisateur
         WHERE c.idCours = ?`,
        [id]
      ),
      query(
        `SELECT 
           id,
           type,
           url,
           created_at
         FROM Resources 
         WHERE courseId = ?`,
        [id]
      )
    ]);

    if (coursResults.length === 0) {
      return res.status(404).json({ message: 'Cours introuvable' });
    }

    const cours = coursResults[0];

    const coursDetails = {
      informations: {
        idCours: cours.idCours,
        titre: cours.titre,
        description: cours.description,
        support: cours.support,
        DateCours: cours.DateCours,
        created_at: cours.created_at,
        updated_at: cours.updated_at,
        nomEnseignant: cours.nomEnseignant,
        prenomEnseignant: cours.prenomEnseignant
      },
      ressources: ressourcesResults
    };

    res.json(coursDetails);

  } catch (err) {
    console.error('Erreur lors de la récupération des détails du cours:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


