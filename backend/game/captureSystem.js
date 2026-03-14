'use strict';

const CAPTURE_RANGE_METERS = 2;

/**
 * Detect players that the demogorgon can capture (within 2 meters).
 * Only runs when the given player has role "demogorgon".
 * @param {Object} player - { id, role, position: { x, y } }
 * @param {Array} players - All players with id, name, position, alive
 * @returns {Array} Captured players as [{ id, name }]
 */
function detectCaptures(player, players) {
  if (!player || player.role !== 'demogorgon') {
    return [];
  }

  const px = player.position?.x ?? 0;
  const py = player.position?.y ?? 0;
  const captured = [];

  for (const other of players) {
    if (other.id === player.id) continue;
    if (other.alive === false) continue;

    const ox = other.position?.x ?? 0;
    const oy = other.position?.y ?? 0;
    const dx = px - ox;
    const dy = py - oy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= CAPTURE_RANGE_METERS) {
      captured.push({
        id: other.id,
        name: other.name,
      });
    }
  }

  return captured;
}

module.exports = {
  detectCaptures,
};