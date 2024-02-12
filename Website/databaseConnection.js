const mysql = require('mysql');

// Database connection configuration
const dbConfig = {
  host: 'your-rds-hostname.amazonaws.com',
  user: 'admin',
  password: 'Trashcan2002!',
  database: 'FinalProject',
};

const connection = mysql.createConnection(dbConfig);

connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Successfully connected to the database.');
});

module.exports = connection;
