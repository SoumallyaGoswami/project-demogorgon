'use strict';

const { addPlayer, getPlayers } = require('../game/gameState');

function registerLobbyEvents(socket, io) {
  socket.on('joinLobby', (data) => {
    // Validate data
    if (!data || typeof data.name !== 'string' || !data.name.trim()) {
      return;
    }

    const trimmedName = data.name.trim();

    const player = {
      id: socket.id,
      name: trimmedName,
    };

    // Add player to game state
    addPlayer(player);

    // Broadcast updated player list
    io.emit('playerListUpdate', getPlayers());
  });
}

module.exports = {
  registerLobbyEvents,
};