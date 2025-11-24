const connection = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getResourcesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validation
    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de cours invalide' 
      });
    }

    const results = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT r.*, c.titre AS titreCours
         FROM Resources r
         JOIN Cours c ON r.courseId = c.idCours
         WHERE r.courseId = ?`,
        [courseId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('Erreur getResourcesByCourse:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des ressources'
    });
  }
};

exports.addResource = async (req, res) => {
  try {
    const { courseId, type, url } = req.body;
    
    // Validation des données requises
    if (!courseId || !type) {
      return res.status(400).json({
        success: false,
        error: 'courseId et type sont requis'
      });
    }

    // Vérifier qu'au moins un fichier OU une URL est fourni
    if (!url && !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Vous devez fournir un fichier OU une URL'
      });
    }

    let filePath = null;
    
    // Gestion du fichier uploadé
    if (req.file) {
      filePath = "/uploads/" + req.file.filename;
      console.log(`📁 Fichier uploadé: ${req.file.filename}`);
    }

    // Insertion dans la base de données
    const result = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO Resources (courseId, type, url, filePath) VALUES (?, ?, ?, ?)',
        [courseId, type, url || null, filePath],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    res.status(201).json({
      success: true,
      message: 'Ressource ajoutée avec succès',
      data: {
        id: result.insertId,
        courseId,
        type,
        url: url || null,
        filePath
      }
    });

  } catch (error) {
    console.error('Erreur addResource:', error);
    
    // Nettoyer le fichier uploadé en cas d'erreur
    if (req.file) {
      const filePath = path.join('uploads', req.file.filename);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Erreur suppression fichier:', unlinkErr);
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout de la ressource'
    });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, url } = req.body;

    // Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de ressource invalide'
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Le type est requis'
      });
    }

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE Resources SET type = ?, url = ? WHERE id = ?',
        [type, url || null, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ressource non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Ressource mise à jour avec succès',
      data: { id, type, url }
    });

  } catch (error) {
    console.error('Erreur updateResource:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de la ressource'
    });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de ressource invalide'
      });
    }

    // Récupérer les infos de la ressource avant suppression
    const resource = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT filePath FROM Resources WHERE id = ?',
        [id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
        }
      );
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Ressource non trouvée'
      });
    }

    // Supprimer de la base de données
    const result = await new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM Resources WHERE id = ?',
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Supprimer le fichier physique s'il existe
    if (resource.filePath) {
      const filename = resource.filePath.replace('/uploads/', '');
      const filePath = path.join('uploads', filename);
      
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Erreur suppression fichier:', err);
        }
      });
    }

    res.json({
      success: true,
      message: 'Ressource supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteResource:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de la ressource'
    });
  }
};