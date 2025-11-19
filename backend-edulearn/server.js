require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./src/config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Vérifier que l'env est chargé
console.log('ENV:', process.env.DB_USER, process.env.DB_NAME);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/cours', require('./src/routes/coursRoutes'));
app.use('/api/inscription', require('./src/routes/inscriptionRoutes'));
app.use('/api/profile', require('./src/routes/profileRoutes'));
app.use('/api/resources', require('./src/routes/resourceRoutes'));
const contactRoutes = require('./src/routes/contacts');
const statsRoutes = require('./src/routes/statsRoutes');
const evaluationRoutes = require('./src/routes/evaluationRoute');

app.use('/api/contact', contactRoutes);
app.use('/api/statistiques', statsRoutes);
app.use('/api/evaluations', evaluationRoutes);

app.use('/api/admin', require('./src/routes/adminRoutes'));


app.get('/', (req, res) => {
  res.json({ message: 'Backend éducatif opérationnel !' });
});

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
