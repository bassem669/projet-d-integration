// controllers/statsController.js
const connection = require('../config/db');

// ==================== DASHBOARD ÉTUDIANT ====================

const getStudentStats = async (req, res) => {
    const { idEtudiant } = req.params;

    try {
        const [coursDisponibles] = await connection.promise().query(`
            SELECT COUNT(*) as nombreCours FROM inscription WHERE idEtudiant = ?
        `, [idEtudiant]);

        const [quizCompletes] = await connection.promise().query(`
            SELECT COUNT(DISTINCT idQuiz) as nombreQuiz FROM ResultatQuiz WHERE idEtudiant = ?
        `, [idEtudiant]);

        const [examensPasses] = await connection.promise().query(`
            SELECT COUNT(DISTINCT idExamen) as nombreExamens FROM ResultatExamen WHERE idEtudiant = ?
        `, [idEtudiant]);

        const stats = {
            nombreCours: coursDisponibles[0].nombreCours || 0,
            nombreQuiz: quizCompletes[0].nombreQuiz || 0,
            nombreExamens: examensPasses[0].nombreExamens || 0
        };

        res.json(stats);

    } catch (error) {
        console.error('Erreur stats étudiant:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ==================== DASHBOARD ENSEIGNANT ====================

const getTeacherStats = async (req, res) => {
    const { idEnseignant } = req.params;

    try {
        // Nombre de cours
        const [totalCours] = await connection.promise().query(`
            SELECT COUNT(*) as nombreCours FROM Cours WHERE idUtilisateur = ?
        `, [idEnseignant]);

        // Nombre d'étudiants inscrits
        const [etudiantsInscrits] = await connection.promise().query(`
            SELECT COUNT(DISTINCT i.idEtudiant) as nombreEtudiants
            FROM inscription i
            JOIN Cours c ON i.idCours = c.idCours
            WHERE c.idUtilisateur = ?
        `, [idEnseignant]);

        // Nombre de ressources
        const [totalRessources] = await connection.promise().query(`
            SELECT COUNT(*) as nombreRessources
            FROM Resources r
            JOIN Cours c ON r.courseId = c.idCours
            WHERE c.idUtilisateur = ?
        `, [idEnseignant]);

        const stats = {
            nombreCours: totalCours[0].nombreCours || 0,
            nombreEtudiants: etudiantsInscrits[0].nombreEtudiants || 0,
            nombreRessources: totalRessources[0].nombreRessources || 0
        };

        res.json(stats);

    } catch (error) {
        console.error('Erreur stats enseignant:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ==================== DASHBOARD ADMIN ====================

const getAdminDashboardStats = async (req, res) => {
    try {
        // Statistiques utilisateurs
        const [userStats] = await connection.promise().query(`
            SELECT 
                COUNT(*) as totalUsers,
                SUM(CASE WHEN role = 'etudiant' THEN 1 ELSE 0 END) as etudiants,
                SUM(CASE WHEN role = 'enseignant' THEN 1 ELSE 0 END) as enseignants,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
            FROM Utilisateur
        `);

        // Statistiques cours
        const [courseStats] = await connection.promise().query(`
            SELECT 
                COUNT(*) as totalCours,
                SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as enAttente,
                SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as valides,
                SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as refuses
            FROM Cours
        `);

        const stats = {
            utilisateurs: {
                total: userStats[0].totalUsers || 0,
                etudiants: userStats[0].etudiants || 0,
                enseignants: userStats[0].enseignants || 0,
                admins: userStats[0].admins || 0
            },
            cours: {
                total: courseStats[0].totalCours || 0,
                enAttente: courseStats[0].enAttente || 0,
                valides: courseStats[0].valides || 0,
                refuses: courseStats[0].refuses || 0
            }
        };

        res.json(stats);

    } catch (error) {
        console.error('Erreur stats admin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getStudentStats,
    getTeacherStats,
    getAdminDashboardStats
};