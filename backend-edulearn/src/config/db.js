const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true,
});

connection.connect(err => {
  if (err) {
    console.error('Erreur de connexion MySQL :', err.message);
    return;
  }
  console.log('Connecté à MySQL avec la base', process.env.DB_NAME);
});

module.exports = connection;
