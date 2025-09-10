const express = require('express');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

let playerData = [];

app.post('/data', (req, res) => {
    try {
        const data = req.body; // Expect raw JSON
        if (!data || !data.name || !data.x || !data.y) {
            console.error('Invalid request: Missing required fields');
            return res.status(400).send('Missing required fields');
        }
        playerData = [data];
        console.log('Received:', playerData);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error parsing data:', err.message);
        res.status(400).send('Invalid data format');
    }
});

app.get('/data', (req, res) => {
    res.json(playerData);
});

app.get('/', (req, res) => {
    res.send('EMM Backend Running');
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
