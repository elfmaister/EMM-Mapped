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
    playerData = [JSON.parse(req.body.data)];
    console.log('Received:', playerData);
    res.sendStatus(200);
});

app.get('/data', (req, res) => {
    res.json(playerData);
});

// Add root route
app.get('/', (req, res) => {
    res.send('EMM Backend Running');
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
