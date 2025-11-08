require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./src/config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Vérifier que l'env est chargé
console.log('ENV:', process.env.DB_USER, process.env.DB_NAME);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/cours', require('./src/routes/coursRoutes'));
app.use('/api/resources', require('./src/routes/resourceRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Backend éducatif opérationnel !' });
});

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
