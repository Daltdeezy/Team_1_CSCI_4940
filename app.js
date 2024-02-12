// app.js
const express = require('express');
const db = require('./Website/databaseConnection'); // Update the path as necessary

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

function fetchLatestBusLocation() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM bus_locations ORDER BY timestamp DESC LIMIT 1';
    db.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
}

app.get('/api/latest-bus-location', async (req, res) => {
  try {
    const location = await fetchLatestBusLocation();
    res.json(location);
  } catch (error) {
    console.error('Failed to fetch latest bus location:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
