const gameState = {
  // Map of playerId -> player object
  players: {},

  // Map of playerId -> role string (if you want fast lookup)
  roles: {},

  // "lobby" | "dispersal" | "active"
  status: 'lobby',

  // Simple arena definition; adjust as needed
  arena: {
    center: { x: 0, y: 0 },
    radius: 100,
  },

  // Game timer value (e.g. seconds)
  timer: 0,
};

function addPlayer(player) {
  const id = player.id;
  if (!id) return;

  const existing = gameState.players[id] || {};

  const fullPlayer = {
    id,
    name: player.name ?? existing.name ?? 'Unknown',
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

function removePlayer(playerId) {
  if (!playerId) return;

  delete gameState.players[playerId];
  delete gameState.roles[playerId];
}

function getPlayers() {
  return Object.values(gameState.players);
}

module.exports = {
  gameState,
  addPlayer,
  removePlayer,
  getPlayers,
};

