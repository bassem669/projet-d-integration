const connection = require("../config/db");
const bcrypt = require("bcrypt");


exports.getProfile = (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT idUtilisateur, nom, email, phone, subject, profilePicture FROM Utilisateur WHERE idUtilisateur = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });

      res.json(results[0]);
    }
  );
};


exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { nom, phone, subject } = req.body;

  connection.query(
    `UPDATE Utilisateur SET nom = ?, phone = ?, subject = ? WHERE idUtilisateur = ?`,
    [nom, phone, subject, userId],
    err => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });

      res.json({ message: "Profil mis à jour" });
    }
  );
};


exports.changePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  connection.query(
    "SELECT motDePasse FROM Utilisateur WHERE idUtilisateur = ?",
    [userId],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });

      const user = results[0];
      const match = await bcrypt.compare(oldPassword, user.motDePasse);

      if (!match) {
        return res.status(400).json({ message: "Ancien mot de passe incorrect" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      connection.query(
        "UPDATE Utilisateur SET motDePasse = ? WHERE idUtilisateur = ?",
        [hashed, userId],
        err => {
          if (err) return res.status(500).json({ error: "Erreur serveur" });

          res.json({ message: "Mot de passe changé avec succès" });
        }
      );
    }
  );
};


exports.updateProfilePicture = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "Aucune photo trouvée" });
  }

  const picturePath = "/uploads/profile-pictures/" + req.file.filename;

  connection.query(
    "UPDATE Utilisateur SET profilePicture = ? WHERE idUtilisateur = ?",
    [picturePath, userId],
    err => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });

      res.json({
        message: "Photo de profil mise à jour",
        profilePicture: picturePath
      });
    }
  );
};
