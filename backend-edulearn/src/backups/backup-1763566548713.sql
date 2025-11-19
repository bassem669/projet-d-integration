/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: audit_logs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `idLog` int(11) NOT NULL AUTO_INCREMENT,
  `adminId` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `method` varchar(10) NOT NULL,
  `route` varchar(255) NOT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `date_action` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idLog`),
  KEY `adminId` (`adminId`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backuphistory
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backuphistory` (
  `idBackup` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `taille` varchar(50) DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `dateBackup` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idBackup`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: classe
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `classe` (
  `idClasse` int(11) NOT NULL AUTO_INCREMENT,
  `nomClasse` varchar(255) NOT NULL,
  `nbEtud` int(11) DEFAULT NULL,
  `idUtilisateur` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idClasse`),
  KEY `fk_classe_utilisateur` (`idUtilisateur`),
  CONSTRAINT `fk_classe_utilisateur` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: contact
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `contact` (
  `idContact` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idContact`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cours
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cours` (
  `idCours` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `support` varchar(255) DEFAULT NULL,
  `DateCours` date DEFAULT NULL,
  `idClasse` int(11) DEFAULT NULL,
  `idUtilisateur` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(20) DEFAULT 'PENDING',
  PRIMARY KEY (`idCours`),
  KEY `idClasse` (`idClasse`),
  KEY `idUtilisateur` (`idUtilisateur`),
  CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`),
  CONSTRAINT `cours_ibfk_2` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: evaluationpdf
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `evaluationpdf` (
  `idEvaluation` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `idCours` int(11) DEFAULT NULL,
  `fichierEvaluation` varchar(255) DEFAULT NULL,
  `dateLimite` datetime DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idEvaluation`),
  KEY `fk_evaluation_cours` (`idCours`),
  CONSTRAINT `fk_evaluation_cours` FOREIGN KEY (`idCours`) REFERENCES `cours` (`idCours`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: examen
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `examen` (
  `idExamen` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `duree` int(11) DEFAULT NULL,
  `idCours` int(11) DEFAULT NULL,
  `idUtilisateur` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idExamen`),
  KEY `fk_examen_cours` (`idCours`),
  KEY `fk_examen_utilisateur` (`idUtilisateur`),
  CONSTRAINT `fk_examen_cours` FOREIGN KEY (`idCours`) REFERENCES `cours` (`idCours`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_examen_utilisateur` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: forum
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `forum` (
  `idMessage` int(11) NOT NULL AUTO_INCREMENT,
  `contenu` text NOT NULL,
  `datePublication` date DEFAULT NULL,
  `idUtilisateur` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idMessage`),
  KEY `fk_forum_utilisateur` (`idUtilisateur`),
  CONSTRAINT `fk_forum_utilisateur` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: inscription
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `inscription` (
  `idInscription` int(11) NOT NULL AUTO_INCREMENT,
  `idEtudiant` int(11) NOT NULL,
  `idCours` int(11) NOT NULL,
  `dateInscription` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idInscription`),
  UNIQUE KEY `unique_inscription` (`idEtudiant`, `idCours`),
  KEY `fk_inscription_cours` (`idCours`),
  CONSTRAINT `fk_inscription_cours` FOREIGN KEY (`idCours`) REFERENCES `cours` (`idCours`) ON DELETE CASCADE,
  CONSTRAINT `fk_inscription_etudiant` FOREIGN KEY (`idEtudiant`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: question
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `question` (
  `idQuestion` int(11) NOT NULL AUTO_INCREMENT,
  `enonce` text NOT NULL,
  `reponseCorrecte` text DEFAULT NULL,
  `idExamen` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idQuestion`),
  KEY `fk_question_examen` (`idExamen`),
  CONSTRAINT `fk_question_examen` FOREIGN KEY (`idExamen`) REFERENCES `examen` (`idExamen`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: questionquiz
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `questionquiz` (
  `idQuestion` int(11) NOT NULL AUTO_INCREMENT,
  `enonce` text NOT NULL,
  `type` varchar(50) DEFAULT 'choix_multiple',
  `idQuiz` int(11) DEFAULT NULL,
  `ordre` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idQuestion`),
  KEY `fk_questionquiz_quiz` (`idQuiz`),
  CONSTRAINT `fk_questionquiz_quiz` FOREIGN KEY (`idQuiz`) REFERENCES `quiz` (`idQuiz`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: quiz
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `quiz` (
  `idQuiz` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `idCours` int(11) DEFAULT NULL,
  `duree` int(11) DEFAULT 30,
  `nbQuestions` int(11) DEFAULT 10,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idQuiz`),
  KEY `fk_quiz_cours` (`idCours`),
  CONSTRAINT `fk_quiz_cours` FOREIGN KEY (`idCours`) REFERENCES `cours` (`idCours`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: reponseevaluation
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reponseevaluation` (
  `idReponse` int(11) NOT NULL AUTO_INCREMENT,
  `idEvaluation` int(11) DEFAULT NULL,
  `idEtudiant` int(11) DEFAULT NULL,
  `fichierReponse` varchar(255) DEFAULT NULL,
  `dateSoumission` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` varchar(20) DEFAULT 'soumis',
  `note` decimal(5, 2) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  PRIMARY KEY (`idReponse`),
  UNIQUE KEY `unique_soumission` (`idEvaluation`, `idEtudiant`),
  KEY `fk_reponse_etudiant` (`idEtudiant`),
  CONSTRAINT `fk_reponse_etudiant` FOREIGN KEY (`idEtudiant`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_reponse_evaluation` FOREIGN KEY (`idEvaluation`) REFERENCES `evaluationpdf` (`idEvaluation`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: reponsepossible
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reponsepossible` (
  `idReponse` int(11) NOT NULL AUTO_INCREMENT,
  `reponse` text NOT NULL,
  `correct` tinyint(1) DEFAULT 0,
  `idQuestion` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idReponse`),
  KEY `fk_reponsepossible_question` (`idQuestion`),
  CONSTRAINT `fk_reponsepossible_question` FOREIGN KEY (`idQuestion`) REFERENCES `questionquiz` (`idQuestion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: resources
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `cours` (`idCours`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: resultatexamen
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `resultatexamen` (
  `idResultat` int(11) NOT NULL AUTO_INCREMENT,
  `note` float DEFAULT NULL,
  `date` date DEFAULT NULL,
  `idEtudiant` int(11) DEFAULT NULL,
  `idExamen` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idResultat`),
  KEY `fk_resultatexamen_etudiant` (`idEtudiant`),
  KEY `fk_resultatexamen_examen` (`idExamen`),
  CONSTRAINT `fk_resultatexamen_etudiant` FOREIGN KEY (`idEtudiant`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_resultatexamen_examen` FOREIGN KEY (`idExamen`) REFERENCES `examen` (`idExamen`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: resultatquiz
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `resultatquiz` (
  `idResultat` int(11) NOT NULL AUTO_INCREMENT,
  `note` float DEFAULT NULL,
  `tempsUtilise` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `idEtudiant` int(11) DEFAULT NULL,
  `idQuiz` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idResultat`),
  KEY `fk_resultatquiz_etudiant` (`idEtudiant`),
  KEY `fk_resultatquiz_quiz` (`idQuiz`),
  CONSTRAINT `fk_resultatquiz_etudiant` FOREIGN KEY (`idEtudiant`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_resultatquiz_quiz` FOREIGN KEY (`idQuiz`) REFERENCES `quiz` (`idQuiz`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: securitystatus
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `securitystatus` (
  `idSecurity` int(11) NOT NULL AUTO_INCREMENT,
  `httpsEnabled` tinyint(1) DEFAULT NULL,
  `rateLimit` int(11) DEFAULT NULL,
  `attemptsBlocked` int(11) DEFAULT NULL,
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idSecurity`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: utilisateur
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `utilisateur` (
  `idUtilisateur` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `niveau` varchar(50) DEFAULT NULL,
  `progression` varchar(255) DEFAULT NULL,
  `notes` float DEFAULT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpire` datetime DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: audit_logs
# ------------------------------------------------------------

INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    1,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users',
    '::1',
    '2025-11-19 16:13:48'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    2,
    NULL,
    'Maj rôle utilisateur',
    'PUT',
    '/api/admin/users/2/role',
    '::1',
    '2025-11-19 16:15:30'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    3,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-19 16:17:29'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    4,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-19 16:21:27'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    5,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-19 16:23:05'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    6,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-19 16:24:48'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    7,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-19 16:25:32'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    8,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses/pending',
    '::1',
    '2025-11-19 16:25:59'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    9,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/2/status',
    '::1',
    '2025-11-19 16:27:20'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    10,
    NULL,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-19 16:28:01'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    11,
    NULL,
    'Création backup',
    'POST',
    '/api/admin/backup',
    '::1',
    '2025-11-19 16:28:58'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    12,
    NULL,
    'Création backup',
    'POST',
    '/api/admin/backup',
    '::1',
    '2025-11-19 16:29:54'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    13,
    NULL,
    'Création backup',
    'POST',
    '/api/admin/backup',
    '::1',
    '2025-11-19 16:31:49'
  );
INSERT INTO
  `audit_logs` (
    `idLog`,
    `adminId`,
    `action`,
    `method`,
    `route`,
    `ip`,
    `date_action`
  )
VALUES
  (
    14,
    NULL,
    'Création backup',
    'POST',
    '/api/admin/backup',
    '::1',
    '2025-11-19 16:35:48'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backuphistory
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: classe
# ------------------------------------------------------------

INSERT INTO
  `classe` (
    `idClasse`,
    `nomClasse`,
    `nbEtud`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    'Classe de Mathématiques',
    25,
    2,
    '2025-11-17 16:26:20',
    '2025-11-17 16:26:20'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: contact
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cours
# ------------------------------------------------------------

INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
    `support`,
    `DateCours`,
    `idClasse`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    1,
    'Mathématiques Avancées',
    'Cours de mathématiques pour niveau universitaire',
    '1763393233539-ch3_description et caractÃ©ristique du UP-1 23 10 2025.pdf',
    '2024-01-20',
    2,
    2,
    '2025-11-17 16:27:13',
    '2025-11-18 21:11:44',
    'REJECTED'
  );
INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
    `support`,
    `DateCours`,
    `idClasse`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    2,
    'Cours de Maths',
    'Introduction aux maths',
    '1763496020835-Rodrigo Silva on LinkedIn_ ?????? _ 45 comments.jpeg',
    NULL,
    NULL,
    3,
    '2025-11-18 21:00:20',
    '2025-11-19 16:27:20',
    'APPROVED'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: evaluationpdf
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: examen
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: forum
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inscription
# ------------------------------------------------------------

INSERT INTO
  `inscription` (
    `idInscription`,
    `idEtudiant`,
    `idCours`,
    `dateInscription`
  )
VALUES
  (1, 3, 1, '2025-11-17 16:34:06');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: question
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: questionquiz
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: quiz
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reponseevaluation
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reponsepossible
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: resources
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: resultatexamen
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: resultatquiz
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: securitystatus
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: utilisateur
# ------------------------------------------------------------

INSERT INTO
  `utilisateur` (
    `idUtilisateur`,
    `nom`,
    `prenom`,
    `email`,
    `motDePasse`,
    `role`,
    `niveau`,
    `progression`,
    `notes`,
    `specialite`,
    `created_at`,
    `updated_at`,
    `resetToken`,
    `resetTokenExpire`,
    `phone`,
    `subject`,
    `profilePicture`,
    `status`
  )
VALUES
  (
    2,
    'maram',
    'kmira',
    'maram@gmail.com.com',
    '$2b$10$FBrvxrMIcD8z/ufie1lkO.fl75CfApU/wDlChvcBP5gx6OU995E7m',
    'etudiant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-17 16:20:19',
    '2025-11-19 16:25:32',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    1
  );
INSERT INTO
  `utilisateur` (
    `idUtilisateur`,
    `nom`,
    `prenom`,
    `email`,
    `motDePasse`,
    `role`,
    `niveau`,
    `progression`,
    `notes`,
    `specialite`,
    `created_at`,
    `updated_at`,
    `resetToken`,
    `resetTokenExpire`,
    `phone`,
    `subject`,
    `profilePicture`,
    `status`
  )
VALUES
  (
    3,
    'nermouna',
    'belgharek',
    'nermine@gmail.com.com',
    '$2b$10$Q.YjHvAY04GDzaYaZ5THNOlYPdrASAq8bjNNyRXnMb.Uv/ztlxMQu',
    'etudiant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-17 16:20:51',
    '2025-11-17 17:36:50',
    NULL,
    NULL,
    '52693000',
    'Mathématiques',
    '/uploads/profile-pictures/1763397410900-424247130.jpeg',
    1
  );
INSERT INTO
  `utilisateur` (
    `idUtilisateur`,
    `nom`,
    `prenom`,
    `email`,
    `motDePasse`,
    `role`,
    `niveau`,
    `progression`,
    `notes`,
    `specialite`,
    `created_at`,
    `updated_at`,
    `resetToken`,
    `resetTokenExpire`,
    `phone`,
    `subject`,
    `profilePicture`,
    `status`
  )
VALUES
  (
    4,
    'najett',
    'hammami',
    'najet@gmail.com',
    '$2b$10$wywN9aIv51ti9EN0lg5AXOEnPI1uvzUmmf3cHOm7P/fd7n/JI8Wkm',
    'enseignant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-18 20:57:03',
    '2025-11-18 20:57:03',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    1
  );
INSERT INTO
  `utilisateur` (
    `idUtilisateur`,
    `nom`,
    `prenom`,
    `email`,
    `motDePasse`,
    `role`,
    `niveau`,
    `progression`,
    `notes`,
    `specialite`,
    `created_at`,
    `updated_at`,
    `resetToken`,
    `resetTokenExpire`,
    `phone`,
    `subject`,
    `profilePicture`,
    `status`
  )
VALUES
  (
    5,
    'admin',
    'ee',
    'admin@gmail.com',
    '$2b$10$iIgh3YQOTH7.65ilB57lKuTqlRIXPX9bv/yP7RvzjNc2oazijYmr.',
    'admin',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-18 21:04:42',
    '2025-11-18 21:04:42',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    1
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
