'use strict';

const { addPlayer, getPlayers } = require('../game/gameState');
const { assignRoles } = require('../game/roles');

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

  socket.on('startGame', () => {
    const players = getPlayers();

    if (!players || players.length === 0) {
      return;
    }

    assignRoles(players);

    console.log('Game starting...');
    console.log('Roles assigned:', players);

    players.forEach((player) => {
      io.to(player.id).emit('roleAssigned', {
        role: player.role,
      });
    });

    io.emit('gameStarted');
  });
}

module.exports = {
  registerLobbyEvents,
};