'use strict';

const {
  addPlayer,
  getPlayers,
  updatePlayerPosition,
  setPlayerCaptured,
  consumeSheriffBullet,
} = require('../game/gameState');

const { assignRoles } = require('../game/roles');
const { detectNearbyPlayers } = require('../game/detectionSystem');
const { detectCaptures } = require('../game/captureSystem');
const { performSheriffShot } = require('../game/sheriffShoot');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function registerLobbyEvents(socket, io) {

  /*
  PLAYER JOIN
  */
  socket.on('joinLobby', (data) => {

    if (!data || typeof data.name !== 'string' || !data.name.trim()) {
      return;
    }

    const trimmedName = data.name.trim();

    const player = {
      id: socket.id,
      name: trimmedName,
    };

    addPlayer(player);

    io.emit('playerListUpdate', getPlayers());

  });

  /*
  START GAME
  */
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

  /*
  PLAYER MOVEMENT
  */
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
      position: p.position || { x: 0, y: 0 },
      alive: p.alive !== false,
    }));

    // Broadcast updated positions
    io.emit('playerPositions', players);

    const currentPlayer = players.find((p) => p.id === socket.id);

    if (!currentPlayer) return;

    /*
    DEMOGORGON CAPTURE SYSTEM
    */
    const capturedPlayers = detectCaptures(currentPlayer, players);

    for (const victim of capturedPlayers) {

      setPlayerCaptured(victim.id);

      io.to(victim.id).emit('captured');

      io.emit('playerCaptured', {
        id: victim.id,
        name: victim.name,
      });

    }

    /*
    RADAR DETECTION SYSTEM
    */
    const alivePlayers = getPlayers()
      .filter((p) => p.alive !== false)
      .map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        position: p.position || { x: 0, y: 0 },
      }));

    const detectedPlayers = detectNearbyPlayers(currentPlayer, alivePlayers);

    socket.emit('detectedPlayers', detectedPlayers);

  });

  /*
  SHERIFF GUN SYSTEM
  */
  socket.on('sheriffShoot', () => {

    const players = getPlayers();

    const currentPlayer = players.find((p) => p.id === socket.id);

    if (!currentPlayer) return;

    // Only sheriff can shoot
    if (currentPlayer.role !== "sheriff") return;

    // Sheriff must be alive
    if (currentPlayer.alive === false) return;

    const result = performSheriffShot(currentPlayer, players);

    if (!result) return;

    // Consume sheriff bullet
    consumeSheriffBullet(currentPlayer.id);

    // Kill victim
    setPlayerCaptured(result.victim.id);

    io.to(result.victim.id).emit('captured');

    // Broadcast kill notification
    io.emit('playerCaptured', {
      id: result.victim.id,
      name: result.victim.name,
    });

    console.log(`Sheriff shot ${result.victim.name}`);

  });

  /*
  DISCONNECT HANDLING
  */
  socket.on('disconnect', () => {

    console.log(`Player disconnected: ${socket.id}`);

  });

}

module.exports = {
  registerLobbyEvents,
};