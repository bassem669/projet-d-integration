// register.js ce code est modifier  
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const connection = require("./connection");

const router = express.Router();
router.use(bodyParser.json());

// Route d'inscription
router.post("/register", async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    role
  } = req.body;

  // Validation des champs obligatoires
  if (!username || !email || !password || !role) {
    return res.status(400).json({ 
      message: "Username, email, password et rôle sont obligatoires" 
    });
  }

  // Validation du rôle
  const rolesValides = ["etudiant", "enseignant", "admin"];
  if (!rolesValides.includes(role)) {
    return res.status(400).json({ 
      message: "Rôle invalide. Choisissez entre: etudiant, enseignant, admin" 
    });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: "Format d'email invalide" 
    });
  }

  // Validation de la force du mot de passe
  if (password.length < 6) {
    return res.status(400).json({ 
      message: "Le mot de passe doit contenir au moins 6 caractères" 
    });
  }

  // Validation du username
  if (username.length < 3) {
    return res.status(400).json({ 
      message: "Le username doit contenir au moins 3 caractères" 
    });
  }

  try {
    // Vérifier si l'email existe déjà
    const checkEmailSql = "SELECT idUtilisateur FROM Utilisateur WHERE email = ?";
    connection.query(checkEmailSql, [email], async (err, emailResults) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (emailResults.length > 0) {
        return res.status(409).json({ 
          message: "Cet email est déjà utilisé" 
        });
      }

      // Vérifier si le username existe déjà
      const checkUsernameSql = "SELECT idUtilisateur FROM Utilisateur WHERE username = ?";
      connection.query(checkUsernameSql, [username], async (err, usernameResults) => {
        if (err) {
          console.error("Erreur MySQL :", err);
          return res.status(500).json({ message: "Erreur serveur" });
        }

        if (usernameResults.length > 0) {
          return res.status(409).json({ 
            message: "Ce username est déjà utilisé" 
          });
        }

        // Hachage du mot de passe
        const saltRounds = 10;
        const passwordHache = await bcrypt.hash(password, saltRounds);

        // Insertion dans la base de données
        const insertSql = `
          INSERT INTO Utilisateur 
          (username, email, password, role) 
          VALUES (?, ?, ?, ?)
        `;

        connection.query(insertSql, [
          username,
          email,
          passwordHache,
          role
        ], (err, results) => {
          if (err) {
            console.error("Erreur lors de l'inscription :", err);
            return res.status(500).json({ message: "Erreur lors de l'inscription" });
          }

          // Succès
          res.status(201).json({
            message: "Inscription réussie",
            user: {
              idUtilisateur: results.insertId,
              username,
              email,
              role
            }
          });
        });
      });
    });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});

module.exports = router;