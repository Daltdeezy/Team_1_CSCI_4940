// app.js
const express = require('express');
const cors = require('cors');
const db = require('./Website/databaseConnection'); // Update the path as necessary

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('website'));
let direction = 'FORWARD'; // This can be stored per bus in a more persistent way if needed

function fetchAllBusLocations() {
  return new Promise((resolve, reject) => {
    const orderBy = direction === 'FORWARD' ? 'ASC' : 'DESC';
    const query = `
      SELECT 
        BusNumber,
        Latitude,
        Longitude,
        Timestamp,
        Status
      FROM 
        AWS.Locations
      ORDER BY 
        Timestamp ${orderBy}
    `;

    db.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results.map(row => ({
        busNumber: row.BusNumber,
        latitude: row.Latitude,
        longitude: row.Longitude,
        timestamp: row.Timestamp,
        status: row.Status
      })));
    });
  });
}

app.get('/api/toggle-direction', (req, res) => {
  direction = direction === 'FORWARD' ? 'REVERSE' : 'FORWARD';
  res.send(`Direction toggled to ${direction}`);
});


app.get('/api/latest-bus-locations', async (req, res) => {
  try {
    const locations = await fetchAllBusLocations();
    res.json(locations);
  } catch (error) {
    console.error('Failed to fetch bus locations:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
