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

    CREATE TABLE IF NOT EXISTS Contact (
        idContact INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS inscription (
        idInscription INT PRIMARY KEY AUTO_INCREMENT,
        idEtudiant INT NOT NULL,
        idCours INT NOT NULL,
        dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_inscription_etudiant FOREIGN KEY (idEtudiant)
            REFERENCES Utilisateur(idUtilisateur) ON DELETE CASCADE,
        CONSTRAINT fk_inscription_cours FOREIGN KEY (idCours)
            REFERENCES Cours(idCours) ON DELETE CASCADE,
        UNIQUE KEY unique_inscription (idEtudiant, idCours)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    ALTER TABLE Utilisateur
        ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL,
        ADD COLUMN IF NOT EXISTS subject VARCHAR(100) NULL,
        ADD COLUMN IF NOT EXISTS profilePicture VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS resetToken VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS resetTokenExpire DATETIME NULL;

    -- Add missing columns to existing tables
ALTER TABLE Quiz 
ADD COLUMN IF NOT EXISTS description TEXT AFTER titre,
ADD COLUMN IF NOT EXISTS duree INT DEFAULT 30 AFTER idCours,
ADD COLUMN IF NOT EXISTS nbQuestions INT DEFAULT 10 AFTER duree,
ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE AFTER nbQuestions;

ALTER TABLE QuestionQuiz 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'choix_multiple' AFTER enonce,
ADD COLUMN IF NOT EXISTS ordre INT DEFAULT 0 AFTER idQuiz;

ALTER TABLE ResultatQuiz 
ADD COLUMN IF NOT EXISTS tempsUtilise INT AFTER note;

-- Create PDF Evaluations tables
CREATE TABLE IF NOT EXISTS EvaluationPDF (
    idEvaluation INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    idCours INT,
    fichierEvaluation VARCHAR(255),
    dateLimite DATETIME,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluation_cours FOREIGN KEY (idCours)
        REFERENCES Cours(idCours) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ReponseEvaluation (
    idReponse INT PRIMARY KEY AUTO_INCREMENT,
    idEvaluation INT,
    idEtudiant INT,
    fichierReponse VARCHAR(255),
    dateSoumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'soumis',
    note DECIMAL(5,2) NULL,
    commentaire TEXT,
    CONSTRAINT fk_reponse_evaluation FOREIGN KEY (idEvaluation)
        REFERENCES EvaluationPDF(idEvaluation) ON DELETE CASCADE,
    CONSTRAINT fk_reponse_etudiant FOREIGN KEY (idEtudiant)
        REFERENCES Utilisateur(idUtilisateur) ON DELETE CASCADE,
    UNIQUE KEY unique_soumission (idEvaluation, idEtudiant)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS BackupHistory (
    idBackup INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50),
    taille VARCHAR(50),
    statut VARCHAR(50),
    dateBackup TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS SecurityStatus (
    idSecurity INT PRIMARY KEY AUTO_INCREMENT,
    httpsEnabled BOOLEAN,
    rateLimit INT,
    attemptsBlocked INT,
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
    idLog INT PRIMARY KEY AUTO_INCREMENT,
    adminId INT NULL,
    action VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    route VARCHAR(255) NOT NULL,
    ip VARCHAR(50),
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adminId) REFERENCES Utilisateur(idUtilisateur)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS LoginAttempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT NULL,
    success BOOLEAN NOT NULL,
    ip VARCHAR(50),
    date_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(idUtilisateur)
        ON DELETE SET NULL
);



`;

connection.query(createTablesQuery, (err) => {
  if (err) {
    console.error('Erreur lors de la création des tables :', err);
  } else {
    console.log('Toutes les tables ont été créées ou vérifiées avec succès.');
  }
  connection.end();
});
