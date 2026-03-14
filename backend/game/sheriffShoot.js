'use strict';

const SHOOT_RANGE_METERS = 50;

/**
 * Perform sheriff shot: find closest alive player within 4 meters and return as victim.
 * Only runs when player is sheriff and hasBullet is true.
 * @param {Object} player - { id, role, hasBullet, position: { x, y } }
 * @param {Array} players - All players with id, name, role, position, alive
 * @returns {{ victim: Object } | null}
 */
function performSheriffShot(player, players) {
  if (!player || player.role !== 'sheriff') {
    return null;
  }
  if (player.hasBullet === false) {
    return null;
  }

  const px = player.position?.x ?? 0;
  const py = player.position?.y ?? 0;

  let closest = null;
  let minDistance = SHOOT_RANGE_METERS;

  for (const other of players) {
    if (other.id === player.id) continue;
    if (other.alive === false) continue;

    const ox = other.position?.x ?? 0;
    const oy = other.position?.y ?? 0;
    const dx = px - ox;
    const dy = py - oy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= SHOOT_RANGE_METERS && distance < minDistance) {
      minDistance = distance;
      closest = other;
    }
  }

  if (!closest) return null;

  return {
    victim: closest,
  };
}

module.exports = {
  performSheriffShot,
};