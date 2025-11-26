const connection = require('../config/db');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const mysqldump = require('mysqldump');
const { sendSecurityAlert } = require('../middleware/emailService');

// ===================== UTILISATEURS =====================
exports.getAllUsers = (req, res) => {
  const { role, search } = req.query;

  let query = `
      SELECT idUtilisateur, nom, prenom, email, role,status, created_at
      FROM Utilisateur
      WHERE 1=1
  `;
  const params = [];

  if (role) {
    query += " AND role = ?";
    params.push(role);
  }

  if (search) {
    query += " AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json(results);
  });
};

exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  connection.query(
    "UPDATE Utilisateur SET role = ? WHERE idUtilisateur = ?",
    [role, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json({ message: "Rôle mis à jour" });
    }
  );
};

exports.toggleUserStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  connection.query(
    "UPDATE Utilisateur SET status=? WHERE idUtilisateur=?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json({ message: `Utilisateur ${status ? 'activé' : 'désactivé'}`  });
    }
  );
};


exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const deleteCours = "DELETE FROM cours WHERE idUtilisateur = ?";
  const deleteUser = "DELETE FROM utilisateur WHERE idUtilisateur = ?";

  connection.query(deleteCours, [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur suppression cours" });
    }

    connection.query(deleteUser, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur suppression utilisateur" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json({ message: "Utilisateur supprimé avec succès" });
    });
  });
};



// ===================== COURS =====================
// backend/controllers/adminController.js
exports.getCourses = (req, res) => {
  const { search } = req.query;

  let query = "SELECT Cours.*, Utilisateur.nom AS nom_enseignant FROM Cours JOIN Utilisateur ON Cours.idUtilisateur = Utilisateur.idUtilisateur WHERE 1 = 1;";
  const params = [];

  if (search) {
    query += " AND (titre LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.json(results);
  });
};



exports.updateCourseStatus = async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.body;

  // Validation du statut
  const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    // 1️⃣ Récupérer le cours et l'auteur
    const [courses] = await connection.promise().query(
      `SELECT C.titre, U.email, U.nom 
       FROM Cours C 
       JOIN Utilisateur U ON C.idUtilisateur = U.idUtilisateur 
       WHERE C.idCours = ?`,
      [courseId]
    );

    if (courses.length === 0) return res.status(404).json({ message: "Cours non trouvé" });

    const course = courses[0];

    // 2️⃣ Mettre à jour le statut du cours
    await connection.promise().query(
      "UPDATE Cours SET status = ? WHERE idCours = ?",
      [status, courseId]
    );

    // 3️⃣ Envoyer l'email à l'auteur
    const statusMessage = status === 'APPROVED' ? 'validé' : status === 'REJECTED' ? 'refusé' : 'en attente';
    const subject = `Mise à jour du statut de votre cours "${course.titre}"`;
    const message = `
      Bonjour ${course.nom},<br><br>
      Le statut de votre cours "<strong>${course.titre}</strong>" a été <strong>${statusMessage}</strong>.<br><br>
      Cordialement,<br>
      L'équipe EduLearn
    `;

    try {
      await sendSecurityAlert(course.email, subject, message);
    } catch (mailErr) {
      console.error('Erreur envoi email:', mailErr);
    }

    // 4️⃣ Répondre au frontend
    res.json({ message: `Cours ${statusMessage} avec succès` });

  } catch (err) {
    console.error('Erreur updateCourseStatus:', err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ===================== LOGS =====================
exports.getAdminLogs = (req, res) => {
  connection.query(
    "SELECT * FROM audit_logs ORDER BY date_action DESC LIMIT 100",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(results);
    }
  );
};

// ===================== BACKUP =====================
exports.createBackup = async (req, res) => {
  try {
    // Nom et chemin du fichier de sauvegarde
    const filename = `backup-${Date.now()}.sql`;
    const backupDir = path.join(__dirname, "../backups");
    const filepath = path.join(backupDir, filename);

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Exécuter le dump
    await mysqldump({
      connection: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      dumpToFile: filepath,
    });

    // Obtenir la taille du fichier
    const stats = fs.statSync(filepath);

    // Insérer dans la table BackupHistory
    connection.query(
      "INSERT INTO backuphistory (type, taille, statut) VALUES (?, ?, ?)",
      ["Manuelle", `${stats.size} bytes`, "Terminée"]
    );

    res.json({ message: "Sauvegarde créée", file: filename });
  } catch (err) {
    console.error("Erreur backup :", err);
    res.status(500).json({ message: "Erreur backup", error: err.message });
  }
};

exports.getBackupsHistory = (req, res) => {
  connection.query(
    "SELECT * FROM BackupHistory ORDER BY dateBackup DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json(results);
    }
  );
};

// ===================== SECURITY =====================
exports.getSecurityStatus = (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM LoginAttempts WHERE success=0 AND date_attempt > NOW() - INTERVAL 24 HOUR) AS blocked,
      (SELECT COUNT(*) FROM LoginAttempts WHERE success=1 AND date_attempt > NOW() - INTERVAL 24 HOUR) AS success
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur getSecurityStatus :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }

    res.json({
      https: req.secure || false,
      rateLimit: '100 req/min',
      blockedAttempts24h: results[0].blocked,
      successfulLogins24h: results[0].success
    });
  });
};

