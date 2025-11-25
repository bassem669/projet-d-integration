require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./src/config/db');
const path = require("path");


const { resetLimiter } = require('./src/middleware/rateLimit');
const { réinitialisationMotDePass } = require('./src/controllers/authController');


const app = express();
app.set("trust proxy", false);
// Middlewares
app.use(cors());
app.use(express.json());

// Vérifier que l'env est chargé
console.log('ENV:', process.env.DB_USER, process.env.DB_NAME);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/cours', require('./src/routes/coursRoutes'));
app.use('/api/resources', require('./src/routes/resourceRoutes'));
const contactRoutes = require('./src/routes/contacts');
app.use('/api/contact', contactRoutes);
app.use('/api/stats', require('./src/routes/statsRoutes'));
app.use('/api/profil', require('./src/routes/profileRoutes'));

app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/evaluation', require('./src/routes/evaluationRoute'));

app.use('/api/forum', require('./src/routes/forumRoute'));
app.use('/api/inscription', require('./src/routes/inscriptionRoutes'));
app.use('/api/quiz', require('./src/routes/quizRoute'));


app.get('/', (req, res) => {
  res.json({ message: 'Backend éducatif opérationnel !' });
});

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
