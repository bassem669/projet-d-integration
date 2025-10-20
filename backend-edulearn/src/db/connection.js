const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  'edulearn',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true 
});

connection.connect(err => {
  if (err) {
    console.error('Erreur de connexion MySQL :', err.message);
    return;
  }
  console.log('Connecté à MySQL avec la base', process.env.DB_NAME);

 
  const createTablesQuery = `
    SET SESSION sql_mode='STRICT_TRANS_TABLES';

    -- ==============================
    -- Table Utilisateur
    -- ==============================
    CREATE TABLE Utilisateur (
        idUtilisateur INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        motDePasse VARCHAR(255) NOT NULL,
        role ENUM('Etudiant', 'Enseignant', 'Administrateur') NOT NULL,
        specialite VARCHAR(255),
        niveau VARCHAR(255),
        noteMoyenne FLOAT
    );

    -- ==============================
    -- Table Classe
    -- ==============================
    CREATE TABLE Classe (
        idClasse INT AUTO_INCREMENT PRIMARY KEY,
        nomClasse VARCHAR(100) NOT NULL,
        nbEtud INT DEFAULT 0,
        idEnseignant INT NOT NULL,
        FOREIGN KEY (idEnseignant) REFERENCES Utilisateur(idUtilisateur)
    );

    -- ==============================
    -- Table Cours
    -- ==============================
    CREATE TABLE Cours (
        idCours INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(100) NOT NULL,
        description TEXT,
        support VARCHAR(255),
        dateCours DATE,
        idClasse INT NOT NULL,
        idEnseignant INT NOT NULL,
        FOREIGN KEY (idClasse) REFERENCES Classe(idClasse),
        FOREIGN KEY (idEnseignant) REFERENCES Utilisateur(idUtilisateur)
    );

    -- ==============================
    -- Table Quiz
    -- ==============================
    CREATE TABLE Quiz (
        idQuiz INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        idCours INT NOT NULL,
        FOREIGN KEY (idCours) REFERENCES Cours(idCours)
    );

    -- ==============================
    -- Table Question
    -- ==============================
    CREATE TABLE Question (
        idQuestion INT AUTO_INCREMENT PRIMARY KEY,
        enonce TEXT NOT NULL,
        reponsesCorrectes TEXT, -- JSON ou séparateur pour stocker plusieurs réponses
        idQuiz INT NOT NULL,
        FOREIGN KEY (idQuiz) REFERENCES Quiz(idQuiz)
    );

    -- ==============================
    -- Table Examen
    -- ==============================
    CREATE TABLE Examen (
        idExamen INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(100) NOT NULL,
        date DATE,
        duree INT,
        idCours INT NOT NULL,
        idEnseignant INT NOT NULL,
        FOREIGN KEY (idCours) REFERENCES Cours(idCours),
        FOREIGN KEY (idEnseignant) REFERENCES Utilisateur(idUtilisateur)
    );

    -- ==============================
    -- Table ResultatQuiz
    -- ==============================
    CREATE TABLE ResultatQuiz (
        idResultatQuiz INT AUTO_INCREMENT PRIMARY KEY,
        idEtudiant INT NOT NULL,
        idQuiz INT NOT NULL,
        note FLOAT,
        datePassage DATE,
        FOREIGN KEY (idEtudiant) REFERENCES Utilisateur(idUtilisateur),
        FOREIGN KEY (idQuiz) REFERENCES Quiz(idQuiz)
    );

    -- ==============================
    -- Table ResultatExamen
    -- ==============================
    CREATE TABLE ResultatExamen (
        idResultatExamen INT AUTO_INCREMENT PRIMARY KEY,
        idEtudiant INT NOT NULL,
        idExamen INT NOT NULL,
        note FLOAT,
        datePassage DATE,
        FOREIGN KEY (idEtudiant) REFERENCES Utilisateur(idUtilisateur),
        FOREIGN KEY (idExamen) REFERENCES Examen(idExamen)
    );

    -- ==============================
    -- Table Forum
    -- ==============================
    CREATE TABLE Forum (
        idMessage INT AUTO_INCREMENT PRIMARY KEY,
        idUtilisateur INT NOT NULL,
        contenu TEXT NOT NULL,
        datePublication DATETIME,
        FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(idUtilisateur)
    );

    -- ==============================
    -- Table Badge
    -- ==============================
    CREATE TABLE Badge (
        idBadge INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        description TEXT,
        dateObtention DATE,
        idNiveau INT NOT NULL,
        FOREIGN KEY (idNiveau) REFERENCES Niveau(idNiveau)
    );

    -- ==============================
    -- Table Niveau
    -- ==============================
    CREATE TABLE Niveau (
        idNiveau INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        description TEXT,
        rang INT
    );

    -- ==============================
    -- Table Condition
    -- ==============================
    CREATE TABLE Condition (
        idCondition INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT,
        type VARCHAR(50),
        valeurMin FLOAT
    );

    -- Table intermédiaire pour lier Condition et Badge (relation N..M)
    CREATE TABLE BadgeCondition (
        idBadge INT NOT NULL,
        idCondition INT NOT NULL,
        PRIMARY KEY (idBadge, idCondition),
        FOREIGN KEY (idBadge) REFERENCES Badge(idBadge),
        FOREIGN KEY (idCondition) REFERENCES Condition(idCondition)
    );

    -- ==============================
    -- Table Statistique
    -- ==============================
    CREATE TABLE Statistique (
        idStatistique INT AUTO_INCREMENT PRIMARY KEY,
        idEtudiant INT NOT NULL,
        nbQuizEffectues INT DEFAULT 0,
        nbExamenEffectues INT DEFAULT 0,
        moyenneQuiz FLOAT DEFAULT 0,
        moyenneExamen FLOAT DEFAULT 0,
        FOREIGN KEY (idEtudiant) REFERENCES Utilisateur(idUtilisateur)
    );

    -- ==============================
    -- Table Progression
    -- ==============================
    CREATE TABLE Progression (
        idProgression INT AUTO_INCREMENT PRIMARY KEY,
        idEtudiant INT NOT NULL,
        idCours INT NOT NULL,
        avancement FLOAT DEFAULT 0,
        dateMiseAJour DATE,
        FOREIGN KEY (idEtudiant) REFERENCES Utilisateur(idUtilisateur),
        FOREIGN KEY (idCours) REFERENCES Cours(idCours)
    );

    -- ==============================
    -- Table EtudiantBadge (relation N..M)
    -- ==============================
    CREATE TABLE EtudiantBadge (
        idEtudiant INT NOT NULL,
        idBadge INT NOT NULL,
        PRIMARY KEY (idEtudiant, idBadge),
        FOREIGN KEY (idEtudiant) REFERENCES Utilisateur(idUtilisateur),
        FOREIGN KEY (idBadge) REFERENCES Badge(idBadge)
    );  
  `;

  connection.query(createTablesQuery, (err) => {
    if (err) {
      console.error('Erreur lors de la création des tables :', err);
    } else {
      console.log('Toutes les tables ont été créées ou vérifiées avec succès.');
    }
  });
});

module.exports = connection;
