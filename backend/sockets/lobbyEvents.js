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

/*
WIN CONDITION CHECK
*/
function checkWinCondition(io) {

  const players = getPlayers();

  const demogorgon = players.find(p => p.role === "demogorgon");

  const humansAlive = players.filter(
    p => p.role !== "demogorgon" && p.alive !== false
  );

  // Humans win if demogorgon dies
  if (!demogorgon || demogorgon.alive === false) {

    io.emit("gameOver", {
      winner: "humans"
    });

    return true;
  }

  // Demogorgon wins if all humans die
  if (humansAlive.length === 0) {

    io.emit("gameOver", {
      winner: "demogorgon"
    });

    return true;
  }

  return false;
}

let gameTimer = null;

/*
MAIN SOCKET REGISTRATION
*/
function registerLobbyEvents(socket, io) {

  /*
  PLAYER JOIN
  */
  socket.on('joinLobby', (data) => {

    if (!data || typeof data.name !== 'string' || !data.name.trim()) {
      return;
    }

    const player = {
      id: socket.id,
      name: data.name.trim(),
    };

    addPlayer(player);

    io.emit('playerListUpdate', getPlayers());

  });

  /*
  START GAME
  */
  socket.on('startGame', () => {

    const players = getPlayers();

    if (!players.length) return;

    assignRoles(players);

    console.log("Game starting...");
    console.log("Roles assigned:", players);

    // 20 second timer (for testing)
    if (gameTimer) clearTimeout(gameTimer);

    gameTimer = setTimeout(() => {

      console.log("TIME UP - HUMANS WIN");

      io.emit("gameOver", {
        winner: "humans",
        reason: "time"
      });

    }, 20000);

    players.forEach(player => {

      io.to(player.id).emit('roleAssigned', {
        role: player.role
      });

    });

    io.emit('gameStarted');

  });

  /*
  TIME UP EVENT (from frontend timer)
  */
  socket.on("timeUp", () => {

    console.log("Timer ended - Humans win");

    io.emit("gameOver", {
      winner: "humans"
    });

  });

  /*
  PLAYER MOVEMENT
  */
  socket.on('updatePosition', (data) => {

    if (
      !data ||
      typeof data.x !== 'number' ||
      typeof data.y !== 'number'
    ) return;

    const clampedX = clamp(data.x, -50, 50);
    const clampedY = clamp(data.y, -50, 50);

    updatePlayerPosition(socket.id, {
      x: clampedX,
      y: clampedY
    });

    const players = getPlayers().map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      position: p.position || { x: 0, y: 0 },
      alive: p.alive !== false
    }));

    io.emit('playerPositions', players);

    const currentPlayer = players.find(p => p.id === socket.id);

    if (!currentPlayer) return;

    /*
    DEMOGORGON CAPTURE
    */
    const capturedPlayers = detectCaptures(currentPlayer, players);

    for (const victim of capturedPlayers) {

      setPlayerCaptured(victim.id);

      io.to(victim.id).emit('captured');

      io.emit('playerCaptured', {
        id: victim.id,
        name: victim.name
      });

      checkWinCondition(io);
    }

    /*
    RADAR DETECTION
    */
    const alivePlayers = getPlayers()
      .filter(p => p.alive !== false)
      .map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        position: p.position || { x: 0, y: 0 }
      }));

    const detectedPlayers = detectNearbyPlayers(currentPlayer, alivePlayers);

    socket.emit('detectedPlayers', detectedPlayers);

  });

  /*
  SHERIFF SHOOT
  */
  socket.on('sheriffShoot', () => {

    const players = getPlayers();

    const currentPlayer = players.find(p => p.id === socket.id);

    if (!currentPlayer) return;
    if (currentPlayer.role !== "sheriff") return;
    if (currentPlayer.alive === false) return;

    const result = performSheriffShot(currentPlayer, players);

    if (!result) return;

    consumeSheriffBullet(currentPlayer.id);

    setPlayerCaptured(result.victim.id);

    io.to(result.victim.id).emit('captured');

    io.emit('playerCaptured', {
      id: result.victim.id,
      name: result.victim.name
    });

    console.log(`Sheriff shot ${result.victim.name}`);

    checkWinCondition(io);

  });

  /*
  DISCONNECT
  */
  socket.on('disconnect', () => {

    console.log(`Player disconnected: ${socket.id}`);

  });

}

module.exports = {
  registerLobbyEvents,
};