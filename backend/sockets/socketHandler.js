'use strict';

const { registerLobbyEvents } = require('./lobbyEvents');
const { gameState, removePlayer, getPlayers } = require('../game/gameState');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Register lobby-related socket events
    registerLobbyEvents(socket, io);

    socket.on('disconnect', () => {
      // Remove player from global game state
      removePlayer(socket.id);

      // Broadcast updated player list to all clients
      io.emit('playerListUpdate', getPlayers());

      console.log(`Player disconnected: ${socket.id}`);
    });
  });
}

module.exports = {
  socketHandler,
};
