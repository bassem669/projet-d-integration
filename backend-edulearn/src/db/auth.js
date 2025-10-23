// auth.js
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const connection = require("./connection"); 
require("dotenv").config();

const app = express();
app.use(bodyParser.json());


//  Route de connexion
app.post("/login", (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const sql = "SELECT * FROM Utilisateur WHERE email = ?";
  connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const utilisateur = results[0];

    // Vérifie le mot de passe (haché dans la base)
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    
    // Redirection selon le rôle
    let redirectUrl = "";
    switch(utilisateur.role) {
      case "etudiant":
        redirectUrl = "/dashboard-etudiant";
        break;
      case "enseignant":
        redirectUrl = "/dashboard-enseignant";
        break;
      case "admin":
        redirectUrl = "/dashboard-admin";
        break;
      default:
        redirectUrl = "/dashboard";
    }

    res.json({ 
      message: "Connexion réussie", 
      user: req.session.user,
      redirectUrl: redirectUrl
    });
  });
});

// Vérifie si l'utilisateur est connecté

//  Déconnexion
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Erreur de déconnexion" });
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnexion réussie" });
  });
});

//  Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur d'auth lancé sur http://localhost:${PORT}`);
});