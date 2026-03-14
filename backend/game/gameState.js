'use strict';

const gameState = {
  players: {},
  roles: {},
  status: "lobby",
  arena: {
    center: { x: 0, y: 0 },
    radius: 100,
  },
  timer: 0,
};

/*
ADD PLAYER
*/
function addPlayer(player) {

  const id = player.id;
  if (!id) return;

  const existing = gameState.players[id] || {};

  const fullPlayer = {
    id,
    name: player.name ?? existing.name ?? "Unknown",
    role: player.role ?? existing.role ?? null,

    position: {
      x: player.position?.x ?? existing.position?.x ?? 0,
      y: player.position?.y ?? existing.position?.y ?? 0,
    },

    alive: player.alive ?? existing.alive ?? true,
    invisible: player.invisible ?? existing.invisible ?? false,
  };

  gameState.players[id] = fullPlayer;

  if (fullPlayer.role) {
    gameState.roles[id] = fullPlayer.role;
  }

}

/*
REMOVE PLAYER
*/
function removePlayer(playerId) {

  if (!playerId) return;

  delete gameState.players[playerId];
  delete gameState.roles[playerId];

}

/*
GET ALL PLAYERS
*/
function getPlayers() {
  return Object.values(gameState.players);
}

/*
GET ONLY ALIVE PLAYERS
*/
function getAlivePlayers() {
  return Object.values(gameState.players).filter(
    (player) => player.alive !== false
  );
}

/*
SET PLAYER ROLE
*/
function setPlayerRole(playerId, role) {

  if (!playerId || !gameState.players[playerId]) return;

  gameState.players[playerId].role = role;
  gameState.roles[playerId] = role;

}

/*
UPDATE PLAYER POSITION
*/
function updatePlayerPosition(playerId, position) {

  if (!playerId || !gameState.players[playerId]) return;

  const player = gameState.players[playerId];

  const x =
    typeof position.x === "number"
      ? position.x
      : player.position?.x ?? 0;

  const y =
    typeof position.y === "number"
      ? position.y
      : player.position?.y ?? 0;

  player.position = { x, y };

}

/*
CAPTURE PLAYER
*/
function setPlayerCaptured(playerId) {

  if (!playerId || !gameState.players[playerId]) return;

  gameState.players[playerId].alive = false;

}

/*
EXPORTS
*/
module.exports = {
  gameState,
  addPlayer,
  removePlayer,
  getPlayers,
  getAlivePlayers,
  setPlayerRole,
  updatePlayerPosition,
  setPlayerCaptured,
};