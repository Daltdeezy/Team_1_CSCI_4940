// databaseConnection.js
const mysql = require('mysql');
const dbConfig = {
  host: 'finalproject.c76memgkqbni.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Trashcan2002!',
  database: 'FinalProject',
  ssl: {
    rejectUnauthorized: true
  }
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
