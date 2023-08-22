// Importing mysql2 package for interacting with MySQL databases
const mysql = require('mysql2');

//environment variables from a .env file
require('dotenv').config();

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export the database connection for use in other modules
module.exports = db;