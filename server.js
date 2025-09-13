const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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
            data = JSON.parse(req.body.data);
        } else {
            data = req.body;
        }
        if (!data || !data.name || data.x == null || data.y == null) {
            console.error('Invalid request: Missing fields', JSON.stringify(req.body, null, 2));
            return res.status(400).send('Missing required fields');
        }
        playerData = [data];
        console.log('Processed:', JSON.stringify(playerData, null, 2));
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ players: playerData }));
            }
        });
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

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.send(JSON.stringify({ players: playerData }));
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT || 3000));
