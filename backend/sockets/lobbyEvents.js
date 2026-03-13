'use strict';
const {
  addPlayer,
  getPlayers,
  updatePlayerPosition,
} = require('../game/gameState');
const { assignRoles } = require('../game/roles');
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
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
  socket.on('updatePosition', (data) => {
    if (
      !data ||
      typeof data.x !== 'number' ||
      typeof data.y !== 'number' ||
      Number.isNaN(data.x) ||
      Number.isNaN(data.y)
    ) {
      return;
    }
    // Clamp to arena square: x, y in [-50, 50]
    const clampedX = clamp(data.x, -50, 50);
    const clampedY = clamp(data.y, -50, 50);
    updatePlayerPosition(socket.id, {
      x: clampedX,
      y: clampedY,
    });
    const players = getPlayers().map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      position: p.position,
    }));
    io.emit('playerPositions', players);
  });
}
module.exports = {
  registerLobbyEvents,
};

