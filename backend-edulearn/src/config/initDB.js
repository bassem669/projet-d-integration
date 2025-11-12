const connection = require('./db');

const createTablesQuery = `
    SET SESSION sql_mode='STRICT_TRANS_TABLES';

    CREATE TABLE IF NOT EXISTS Utilisateur (
        idUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255) NOT NULL,
        prenom VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        motDePasse VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        niveau VARCHAR(50) NULL,
        progression VARCHAR(255) NULL,
        notes FLOAT NULL,
        specialite VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Classe (
        idClasse INT PRIMARY KEY AUTO_INCREMENT,
        nomClasse VARCHAR(255) NOT NULL,
        nbEtud INT,
        idUtilisateur INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_classe_utilisateur FOREIGN KEY (idUtilisateur)
            REFERENCES Utilisateur(idUtilisateur)
            ON DELETE SET NULL
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Cours (
      idCours INT AUTO_INCREMENT PRIMARY KEY,
      titre VARCHAR(255) NOT NULL,
      description TEXT,
      support VARCHAR(255),
      DateCours DATE,
      idClasse INT,
      idUtilisateur INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (idClasse) REFERENCES Classe(idClasse),
      FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(idUtilisateur)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Resources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      courseId INT,
      type VARCHAR(100),
      url VARCHAR(255),
      FOREIGN KEY (courseId) REFERENCES Cours(idCours)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Quiz (
        idQuiz INT PRIMARY KEY AUTO_INCREMENT,
        titre VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        idCours INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_quiz_cours FOREIGN KEY (idCours)
            REFERENCES Cours(idCours)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS QuestionQuiz (
        idQuestion INT PRIMARY KEY AUTO_INCREMENT,
        enonce TEXT NOT NULL,
        idQuiz INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_questionquiz_quiz FOREIGN KEY (idQuiz)
            REFERENCES Quiz(idQuiz)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS ReponsePossible (
        idReponse INT PRIMARY KEY AUTO_INCREMENT,
        reponse TEXT NOT NULL,
        correct BOOLEAN DEFAULT FALSE,
        idQuestion INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_reponsepossible_question FOREIGN KEY (idQuestion)
            REFERENCES QuestionQuiz(idQuestion)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Examen (
        idExamen INT PRIMARY KEY AUTO_INCREMENT,
        titre VARCHAR(255) NOT NULL,
        date DATE,
        duree INT,
        idCours INT,
        idUtilisateur INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_examen_cours FOREIGN KEY (idCours)
            REFERENCES Cours(idCours)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
        CONSTRAINT fk_examen_utilisateur FOREIGN KEY (idUtilisateur)
            REFERENCES Utilisateur(idUtilisateur)
            ON DELETE SET NULL
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Question (
        idQuestion INT PRIMARY KEY AUTO_INCREMENT,
        enonce TEXT NOT NULL,
        reponseCorrecte TEXT,
        idExamen INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_question_examen FOREIGN KEY (idExamen)
            REFERENCES Examen(idExamen)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS Forum (
        idMessage INT PRIMARY KEY AUTO_INCREMENT,
        contenu TEXT NOT NULL,
        datePublication DATE,
        idUtilisateur INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_forum_utilisateur FOREIGN KEY (idUtilisateur)
            REFERENCES Utilisateur(idUtilisateur)
            ON DELETE SET NULL
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS ResultatQuiz (
        idResultat INT PRIMARY KEY AUTO_INCREMENT,
        note FLOAT,
        date DATE,
        idEtudiant INT,
        idQuiz INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_resultatquiz_etudiant FOREIGN KEY (idEtudiant)
            REFERENCES Utilisateur(idUtilisateur)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
        CONSTRAINT fk_resultatquiz_quiz FOREIGN KEY (idQuiz)
            REFERENCES Quiz(idQuiz)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS ResultatExamen (
        idResultat INT PRIMARY KEY AUTO_INCREMENT,
        note FLOAT,
        date DATE,
        idEtudiant INT,
        idExamen INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_resultatexamen_etudiant FOREIGN KEY (idEtudiant)
            REFERENCES Utilisateur(idUtilisateur)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
        CONSTRAINT fk_resultatexamen_examen FOREIGN KEY (idExamen)
            REFERENCES Examen(idExamen)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    -- ✅ AJOUT DU TABLEAU CONTACT
    CREATE TABLE IF NOT EXISTS Contact (
        idContact INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

connection.query(createTablesQuery, (err) => {
  if (err) {
    console.error('Erreur lors de la création des tables :', err);
  } else {
    console.log('Toutes les tables ont été créées ou vérifiées avec succès.');
  }
  connection.end();
});
