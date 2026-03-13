const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { socketHandler } = require('../sockets/socketHandler');

const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Register all socket event handlers
socketHandler(io);

app.get('/', (req, res) => {
  res.send('Game server is running.');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
