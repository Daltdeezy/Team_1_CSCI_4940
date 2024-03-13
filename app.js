// app.js
const express = require('express');
const cors = require('cors');
const db = require('./Website/databaseConnection'); // Update the path as necessary

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('website'));

function fetchAllBusLocations() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        l1.BusNumber,
        l1.Latitude,
        l1.Longitude,
        l1.Timestamp,
        l1.Status
      FROM 
        AWS.Locations l1
      INNER JOIN (
        SELECT 
          BusNumber, 
          MAX(Timestamp) AS latest_timestamp
        FROM 
          AWS.Locations
        GROUP BY 
          BusNumber
      ) l2 ON l1.BusNumber = l2.BusNumber AND l1.Timestamp = l2.latest_timestamp
      ORDER BY 
        l1.BusNumber ASC
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
