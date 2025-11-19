// controllers/statsController.js
const connection = require('../config/db');

const getStudentStats = async (req, res) => {
    const { idEtudiant } = req.params;

    try {
        // 1. Nombre de cours disponibles (inscrits)
        const [coursDisponibles] = await connection.promise().query(`
            SELECT COUNT(*) as nombreCoursDisponibles
            FROM inscription 
            WHERE idEtudiant = ?
        `, [idEtudiant]);

        // 2. Nombre de quiz complétés
        const [quizCompletes] = await connection.promise().query(`
            SELECT COUNT(DISTINCT idQuiz) as nombreQuizCompletes
            FROM ResultatQuiz 
            WHERE idEtudiant = ?
        `, [idEtudiant]);

        // 3. Nombre d'examens passés
        const [examensPasses] = await connection.promise().query(`
            SELECT COUNT(DISTINCT idExamen) as nombreExamensPasses
            FROM ResultatExamen 
            WHERE idEtudiant = ?
        `, [idEtudiant]);

        const statistiques = {
            nombreCoursDisponibles: coursDisponibles[0].nombreCoursDisponibles || 0,
            nombreQuizCompletes: quizCompletes[0].nombreQuizCompletes || 0,
            nombreExamensPasses: examensPasses[0].nombreExamensPasses || 0
        };

        res.json(statistiques);

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getStudentStats
};