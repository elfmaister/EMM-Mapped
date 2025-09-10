const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

// Store latest data
let playerData = [];

// Receive data from GMod
app.post('/data', (req, res) => {
    playerData = [JSON.parse(req.body.data)]; // Update with new data
    console.log('Received:', playerData);
    res.sendStatus(200);
});

// Serve data to browser
app.get('/data', (req, res) => {
    res.json(playerData);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
