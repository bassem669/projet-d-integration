require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const registerRouter = require('./src/db/register'); // chemin vers ton register.js

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', registerRouter);
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Plateforme éducative backend opérationnelle !' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lance sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});
