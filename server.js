const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

let playerData = [];

app.post('/data', (req, res) => {
    try {
        console.log('Raw request body:', JSON.stringify(req.body, null, 2));
        let data;
        if (req.body.data) {
            data = JSON.parse(req.body.data); // Parse form-encoded 'data' field
        } else {
            data = req.body; // Fallback to raw JSON
        }

        if (!data || !data.name || data.x == null || data.y == null) {
            console.error('Invalid request: Missing fields', JSON.stringify(req.body, null, 2));
            return res.status(400).send('Missing required fields');
        }

        playerData = [data];
        console.log('Processed:', JSON.stringify(playerData, null, 2));
        res.sendStatus(200);
    } catch (err) {
        console.error('Error parsing data:', err.message, JSON.stringify(req.body, null, 2));
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
