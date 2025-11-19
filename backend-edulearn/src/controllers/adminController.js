const connection = require('../config/db');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const mysqldump = require('mysqldump');

// ===================== UTILISATEURS =====================
exports.getAllUsers = (req, res) => {
  const { role, search } = req.query;

  let query = `
      SELECT idUtilisateur, nom, prenom, email, role, created_at
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

// ===================== COURS =====================
exports.getPendingCourses = (req, res) => {
  const { search } = req.query;

  let query = "SELECT * FROM Cours WHERE status = 'PENDING'";
  const params = [];

  if (search) {
    query += " AND (titre LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json(results);
  });
};

exports.updateCourseStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  connection.query(
    "UPDATE Cours SET status=? WHERE idCours=?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.json({ message: `Cours ${status.toLowerCase()}` });
    }
  );
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
      "INSERT INTO BackupHistory (type, taille, statut) VALUES (?, ?, ?)",
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

