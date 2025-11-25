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
) ENGINE = InnoDB AUTO_INCREMENT = 125 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: resources
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseId` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `cours` (`idCours`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
  `resetPasswordCode` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
    15,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:38:51'
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
    16,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:38:51'
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
    17,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:41:31'
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
    18,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:41:31'
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
    19,
    NULL,
    'Maj rôle utilisateur',
    'PUT',
    '/api/admin/users/2/role',
    '::1',
    '2025-11-24 20:41:35'
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
    20,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:41:37'
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
    26,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:47:15'
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
    27,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:47:15'
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
    28,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:49:19'
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
    29,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:49:19'
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
    30,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:49:25'
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
    31,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:49:25'
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
    32,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/4/status',
    '::1',
    '2025-11-24 20:49:57'
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
    33,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/4/status',
    '::1',
    '2025-11-24 20:49:59'
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
    34,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:52:06'
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
    35,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 20:52:06'
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
    36,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:55:35'
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
    37,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:55:35'
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
    38,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:55:52'
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
    39,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 20:55:52'
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
    40,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:03:01'
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
    41,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:03:01'
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
    42,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:04:16'
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
    43,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:04:16'
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
    44,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/4/status',
    '::1',
    '2025-11-24 21:06:49'
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
    45,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/4/status',
    '::1',
    '2025-11-24 21:06:50'
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
    46,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/4/status',
    '::ffff:127.0.0.1',
    '2025-11-24 21:08:14'
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
    47,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::ffff:127.0.0.1',
    '2025-11-24 21:08:14'
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
    48,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/5/status',
    '::ffff:127.0.0.1',
    '2025-11-24 21:08:16'
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
    49,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::ffff:127.0.0.1',
    '2025-11-24 21:08:16'
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
    50,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/6/status',
    '::1',
    '2025-11-24 21:08:18'
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
    51,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:08:18'
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
    52,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/7/status',
    '::1',
    '2025-11-24 21:08:19'
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
    53,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:08:19'
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
    54,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:08:26'
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
    55,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:08:27'
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
    56,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:11:59'
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
    57,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/6/status',
    '::1',
    '2025-11-24 21:12:22'
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
    58,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:12:23'
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
    59,
    NULL,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/6/status',
    '::1',
    '2025-11-24 21:12:24'
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
    60,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:12:24'
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
    61,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:12:32'
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
    62,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:12:32'
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
    63,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:12:41'
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
    64,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:12:41'
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
    65,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:17:06'
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
    66,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:17:06'
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
    67,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/4/status',
    '::1',
    '2025-11-24 21:17:11'
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
    68,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:17:18'
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
    69,
    NULL,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:17:18'
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
    70,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:17:19'
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
    71,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:17:19'
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
    72,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:26:27'
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
    73,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:26:27'
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
    74,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-24 21:26:32'
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
    75,
    5,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-24 21:29:32'
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
    76,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:30:34'
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
    77,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:30:34'
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
    78,
    5,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-24 21:30:36'
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
    79,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:34:26'
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
    80,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:34:26'
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
    81,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:34:28'
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
    82,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:34:28'
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
    83,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 21:36:55'
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
    84,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:36:55'
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
    85,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 21:36:56'
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
    86,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:36:56'
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
    87,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 21:37:33'
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
    88,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:37:33'
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
    89,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 21:37:34'
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
    90,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 21:37:34'
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
    91,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:37:36'
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
    92,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:37:36'
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
    93,
    5,
    'Maj rôle utilisateur',
    'PUT',
    '/api/admin/users/3/role',
    '::1',
    '2025-11-24 21:37:40'
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
    94,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:37:41'
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
    95,
    NULL,
    'Maj statut utilisateur',
    'PUT',
    '/api/admin/users/2/status',
    '::1',
    '2025-11-24 21:38:56'
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
    96,
    NULL,
    'Maj rôle utilisateur',
    'PUT',
    '/api/admin/users/4/role',
    '::1',
    '2025-11-24 21:39:00'
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
    97,
    NULL,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 21:39:01'
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
    98,
    NULL,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-24 21:49:17'
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
    99,
    NULL,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-24 21:49:17'
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
    100,
    NULL,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-24 21:50:57'
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
    101,
    NULL,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-24 21:50:57'
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
    102,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 21:59:26'
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
    103,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 21:59:26'
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
    104,
    5,
    'Création backup',
    'POST',
    '/api/admin/backup',
    '::1',
    '2025-11-24 21:59:30'
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
    105,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 21:59:32'
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
    106,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 22:06:42'
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
    107,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 22:06:42'
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
    108,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 22:09:31'
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
    109,
    5,
    'Liste utilisateurs',
    'GET',
    '/api/admin/users?',
    '::1',
    '2025-11-24 22:09:31'
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
    110,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 22:09:43'
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
    111,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 22:09:43'
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
    112,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 22:09:47'
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
    113,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 22:09:47'
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
    114,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 22:09:48'
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
    115,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 22:09:48'
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
    116,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 22:09:51'
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
    117,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 22:09:51'
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
    118,
    5,
    'Changement statut cours',
    'PUT',
    '/api/admin/courses/1/status',
    '::1',
    '2025-11-24 22:09:52'
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
    119,
    5,
    'Cours en attente',
    'GET',
    '/api/admin/courses',
    '::1',
    '2025-11-24 22:09:52'
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
    120,
    5,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-24 22:09:58'
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
    121,
    5,
    'Consultation logs',
    'GET',
    '/api/admin/logs',
    '::1',
    '2025-11-24 22:09:58'
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
    122,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 22:10:10'
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
    123,
    5,
    'Historique backups',
    'GET',
    '/api/admin/backup/history',
    '::1',
    '2025-11-24 22:10:10'
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
    124,
    5,
    'Création backup',
    'POST',
    '/api/admin/backup',
    '::1',
    '2025-11-24 22:10:12'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backuphistory
# ------------------------------------------------------------

INSERT INTO
  `backuphistory` (`idBackup`, `type`, `taille`, `statut`, `dateBackup`)
VALUES
  (
    1,
    'Manuelle',
    '57725 bytes',
    'Terminée',
    '2025-11-24 21:59:32'
  );

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
    '2024-01-17',
    2,
    2,
    '2025-11-17 16:27:13',
    '2025-11-24 22:09:52',
    'REJECTED'
  );
INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
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
    'hello',
    'Introduction aux maths',
    '2025-11-19',
    2,
    3,
    '2025-11-18 21:00:20',
    '2025-11-23 16:34:00',
    'APPROVED'
  );
INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
    `DateCours`,
    `idClasse`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    4,
    'htrgrgjjjjjkkkkkk',
    ',fjrkvnjrngfkrjfn',
    '2025-11-22',
    2,
    6,
    '2025-11-23 16:20:46',
    '2025-11-24 21:08:14',
    'APPROVED'
  );
INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
    `DateCours`,
    `idClasse`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    5,
    'jnfjrvnff',
    'jnchrnvjhbvjhfvhjdf',
    '2025-11-23',
    2,
    6,
    '2025-11-23 16:21:17',
    '2025-11-24 21:08:16',
    'APPROVED'
  );
INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
    `DateCours`,
    `idClasse`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    6,
    'nvdsfjkvnjdf',
    'tzest',
    '2025-11-24',
    2,
    6,
    '2025-11-23 23:54:09',
    '2025-11-24 21:12:24',
    'APPROVED'
  );
INSERT INTO
  `cours` (
    `idCours`,
    `titre`,
    `description`,
    `DateCours`,
    `idClasse`,
    `idUtilisateur`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    7,
    'test',
    'tzest',
    NULL,
    2,
    6,
    '2025-11-23 23:54:10',
    '2025-11-24 21:08:19',
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
INSERT INTO
  `inscription` (
    `idInscription`,
    `idEtudiant`,
    `idCours`,
    `dateInscription`
  )
VALUES
  (2, 7, 4, '2025-11-23 20:17:58');
INSERT INTO
  `inscription` (
    `idInscription`,
    `idEtudiant`,
    `idCours`,
    `dateInscription`
  )
VALUES
  (4, 7, 5, '2025-11-23 20:30:53');
INSERT INTO
  `inscription` (
    `idInscription`,
    `idEtudiant`,
    `idCours`,
    `dateInscription`
  )
VALUES
  (6, 2, 2, '2025-11-24 00:44:20');
INSERT INTO
  `inscription` (
    `idInscription`,
    `idEtudiant`,
    `idCours`,
    `dateInscription`
  )
VALUES
  (7, 2, 1, '2025-11-24 00:44:25');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: question
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: questionquiz
# ------------------------------------------------------------

INSERT INTO
  `questionquiz` (
    `idQuestion`,
    `enonce`,
    `type`,
    `idQuiz`,
    `ordre`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'q 1 ',
    'choix_multiple',
    1,
    0,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `questionquiz` (
    `idQuestion`,
    `enonce`,
    `type`,
    `idQuiz`,
    `ordre`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    'q2',
    'vrai_faux',
    1,
    1,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `questionquiz` (
    `idQuestion`,
    `enonce`,
    `type`,
    `idQuiz`,
    `ordre`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    3,
    'Q3',
    'vrai_faux',
    1,
    2,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `questionquiz` (
    `idQuestion`,
    `enonce`,
    `type`,
    `idQuiz`,
    `ordre`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    4,
    'Q4',
    'vrai_faux',
    1,
    3,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `questionquiz` (
    `idQuestion`,
    `enonce`,
    `type`,
    `idQuiz`,
    `ordre`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    5,
    'Q5',
    'vrai_faux',
    1,
    4,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: quiz
# ------------------------------------------------------------

INSERT INTO
  `quiz` (
    `idQuiz`,
    `titre`,
    `description`,
    `type`,
    `idCours`,
    `duree`,
    `nbQuestions`,
    `actif`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'quiz 1 ',
    'bcjhbeffg',
    'quiz',
    4,
    30,
    5,
    1,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reponseevaluation
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reponsepossible
# ------------------------------------------------------------

INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'a',
    1,
    1,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    'b',
    0,
    1,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    3,
    'c',
    0,
    1,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    4,
    'd',
    0,
    1,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    5,
    'Vrai',
    1,
    2,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    6,
    'Faux',
    0,
    2,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    7,
    'Vrai',
    0,
    3,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    8,
    'Faux',
    1,
    3,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    9,
    'Vrai',
    1,
    4,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    10,
    'Faux',
    0,
    4,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    11,
    'Vrai',
    0,
    5,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );
INSERT INTO
  `reponsepossible` (
    `idReponse`,
    `reponse`,
    `correct`,
    `idQuestion`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    12,
    'Faux',
    1,
    5,
    '2025-11-23 19:38:59',
    '2025-11-23 19:38:59'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: resources
# ------------------------------------------------------------

INSERT INTO
  `resources` (`id`, `courseId`, `type`, `url`, `filePath`)
VALUES
  (1, 5, 'pdf', 'rouserces 1', NULL);
INSERT INTO
  `resources` (`id`, `courseId`, `type`, `url`, `filePath`)
VALUES
  (
    2,
    1,
    'pdf',
    'C:\\fakepath\\rapport de stage 2.pdf',
    NULL
  );
INSERT INTO
  `resources` (`id`, `courseId`, `type`, `url`, `filePath`)
VALUES
  (3, 1, 'pdf', 'C:\\fakepath\\sst.pdf', NULL);
INSERT INTO
  `resources` (`id`, `courseId`, `type`, `url`, `filePath`)
VALUES
  (4, 1, 'pdf', 'C:\\fakepath\\test.html', NULL);
INSERT INTO
  `resources` (`id`, `courseId`, `type`, `url`, `filePath`)
VALUES
  (
    5,
    1,
    'pdf',
    'C:\\fakepath\\rapport de stage 2.pdf',
    NULL
  );

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
    `resetPasswordCode`,
    `resetPasswordExpires`,
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
    'bassemmathlouthi05@gmail.com',
    '$2b$10$keSr5DBY84kjbhwp/3uJq.5MMblVs3d0lwcm10RCr0ArpGIQhrtjW',
    'enseignant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-17 16:20:19',
    '2025-11-24 21:38:56',
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
    `resetPasswordCode`,
    `resetPasswordExpires`,
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
    'enseignant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-17 16:20:51',
    '2025-11-24 21:37:40',
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
    `resetPasswordCode`,
    `resetPasswordExpires`,
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
    'bassathlouthi05@gmail.com',
    '$2b$10$CMyfMeQ5Vu5Umd.vVV9zXuTqCzW6upLpQxx7P0jUNFYcnpnJwHqee',
    'etudiant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-18 20:57:03',
    '2025-11-24 21:39:00',
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
    `resetPasswordCode`,
    `resetPasswordExpires`,
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
    `resetPasswordCode`,
    `resetPasswordExpires`,
    `phone`,
    `subject`,
    `profilePicture`,
    `status`
  )
VALUES
  (
    6,
    'bassem',
    'hassennn',
    'hassen@gmail.com',
    '$2b$10$BIb2ASLIhV/uMZnlBoNnFOykjezxt1cEBzfjoBP5YS03jdHdSAoD.',
    'enseignant',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-11-20 19:57:47',
    '2025-11-23 19:17:51',
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
    `resetPasswordCode`,
    `resetPasswordExpires`,
    `phone`,
    `subject`,
    `profilePicture`,
    `status`
  )
VALUES
  (
    7,
    'bassemjbkhjvkhg',
    'nassim',
    'nassim@gmail.com',
    '$2b$10$JocjYZvYCSI8ZJJWCPuG8.ft4FD8ROAu7qZCta5sceY00h8Bisl0G',
    'etudiant',
    'Licence 3',
    NULL,
    NULL,
    NULL,
    '2025-11-20 20:06:17',
    '2025-11-20 22:39:01',
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
