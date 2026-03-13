'use strict';

const radarRanges = {
  demogorgon: 15,
  security: 10,
  sheriff: 5,
};

/**
 * Get radar targets for the current player based on distance and role-based range.
 * @param {Object} currentPlayer - { id, role, position: { x, y } }
 * @param {Array} players - All players with id, name, role, position
 * @returns {Array} Targets with id, name, role, position, strength
 */
function getRadarTargets(currentPlayer, players) {
  const radarRange = radarRanges[currentPlayer.role];
  if (radarRange == null || typeof radarRange !== 'number' || radarRange <= 0) {
    return [];
  }

  const pos = currentPlayer.position || { x: 0, y: 0 };
  const targets = [];

  for (const player of players) {
    if (player.id === currentPlayer.id) continue;

    const pPos = player.position || { x: 0, y: 0 };
    const distance = Math.sqrt(
      (pPos.x - pos.x) ** 2 + (pPos.y - pos.y) ** 2
    );

    if (distance > radarRange) continue;

    const ratio = distance / radarRange;
    let strength;
    if (ratio <= 0.3) strength = 'strong';
    else if (ratio <= 0.7) strength = 'medium';
    else strength = 'weak';

    targets.push({
      id: player.id,
      name: player.name,
      role: player.role,
      position: { ...pPos },
      strength,
    });
  }

  return targets;
}

module.exports = {
  getRadarTargets,
};
