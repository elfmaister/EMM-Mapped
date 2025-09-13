const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the project root (includes index.html and gm_bigcity/)
app.use(express.static(__dirname));

// MIME types for GLTF assets
app.use('/gm_bigcity', (req, res, next) => {
    if (req.path.endsWith('.gltf')) res.type('model/gltf+json');
    if (req.path.endsWith('.glb')) res.type('model/gltf-binary');
    if (req.path.endsWith('.bin')) res.type('application/octet-stream');
    if (req.path.endsWith('.png') || req.path.endsWith('.jpg') || req.path.endsWith('.jpeg')) res.type('image/jpeg');
    next();
});

// CSP middleware
app.use((req, res, next) => {
    res.set('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='; " +
        "img-src 'self' data:; " +
        "connect-src 'self' wss://emm-mapped.onrender.com wss://*; " +
        "style-src 'self' 'unsafe-inline'; " +
        "font-src 'self' data:;"
    );
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

let playerData = [];

// Handle WebSocket upgrade specifically on /data
server.on('upgrade', (request, socket, head) => {
    if (request.url === '/data') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

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

// Serve index.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Static file not found handler for debugging
app.use((req, res, next) => {
    if (req.method === 'GET' && !res.headersSent) {
        console.log(`404 for static file: ${req.originalUrl}`);
        res.status(404).send('File not found');
    } else {
        next();
    }
});

wss.on('connection', (ws) => {
    console.log('WebSocket client connected to /data');
    ws.send(JSON.stringify({ players: playerData }));
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT || 3000));
