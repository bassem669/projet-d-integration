// register.js
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const connection = require("./connection");

const router = express.Router();
router.use(bodyParser.json());

// Route d'inscription
router.post("/register", async (req, res) => {
  const { 
    nom, 
    prenom, 
    email, 
    motDePasse, 
    role,
    niveau,
    specialite 
  } = req.body;

  // Validation des champs obligatoires
  if (!nom || !prenom || !email || !motDePasse || !role) {
    return res.status(400).json({ 
      message: "Nom, prénom, email, mot de passe et rôle sont obligatoires" 
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
  if (motDePasse.length < 6) {
    return res.status(400).json({ 
      message: "Le mot de passe doit contenir au moins 6 caractères" 
    });
  }

  try {
    // Vérifier si l'email existe déjà
    const checkEmailSql = "SELECT idUtilisateur FROM Utilisateur WHERE email = ?";
    connection.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      if (results.length > 0) {
        return res.status(409).json({ 
          message: "Cet email est déjà utilisé" 
        });
      }

      // Hachage du mot de passe
      const saltRounds = 10;
      const motDePasseHache = await bcrypt.hash(motDePasse, saltRounds);

      // Déterminer les valeurs par défaut selon le rôle
      let valeursNiveau = niveau || null;
      let valeursSpecialite = specialite || null;
      let progressionParDefaut = "0%";
      let notesParDefaut = null;

      // Logique métier selon le rôle
      if (role === "etudiant") {
        progressionParDefaut = "0%";
        notesParDefaut = 0.0;
        // Pour un étudiant, le niveau est obligatoire
        if (!niveau) {
          return res.status(400).json({ 
            message: "Le niveau est obligatoire pour un étudiant" 
          });
        }
      } else if (role === "enseignant") {
        progressionParDefaut = null;
        notesParDefaut = null;
        // Pour un enseignant, la spécialité est importante
        if (!specialite) {
          return res.status(400).json({ 
            message: "La spécialité est obligatoire pour un enseignant" 
          });
        }
      }

      // Insertion dans la base de données
      const insertSql = `
        INSERT INTO Utilisateur 
        (nom, prenom, email, motDePasse, role, niveau, progression, notes, specialite) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(insertSql, [
        nom,
        prenom,
        email,
        motDePasseHache,
        role,
        valeursNiveau,
        progressionParDefaut,
        notesParDefaut,
        valeursSpecialite
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
            nom,
            prenom,
            email,
            role,
            niveau: valeursNiveau,
            specialite: valeursSpecialite
          }
        });
      });
    });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});


module.exports = router ;