const express = require('express');
const busRoutes = require('./routes/busRoutes'); // Adjust the path as necessary

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', busRoutes); // Use bus routes with /api prefix

app.listen(port, () => console.log(`Server running on port ${port}`));
