'use strict';

const ranges = {
  demogorgon: 100,
  security: 100,
  sheriff: 100,
};

// small buffer to prevent radar flicker
const DETECTION_BUFFER = 1;

function detectNearbyPlayers(player, players) {

  const baseRange = ranges[player.role];

  if (typeof baseRange !== 'number' || baseRange <= 0) {
    return [];
  }

  const range = baseRange + DETECTION_BUFFER;
  const rangeSquared = range * range;

  const px = player.position?.x ?? 0;
  const py = player.position?.y ?? 0;

  const detected = [];

  for (const other of players) {

    if (other.id === player.id) continue;

    const ox = other.position?.x ?? 0;
    const oy = other.position?.y ?? 0;

    const dx = px - ox;
    const dy = py - oy;

    const distSquared = dx * dx + dy * dy;

    if (distSquared <= rangeSquared) {

      const distance = Math.sqrt(distSquared);

      detected.push({
        id: other.id,
        name: other.name,
        role: other.role,
        position: { x: ox, y: oy },
        distance
      });

    }

  }

  return detected;
}

module.exports = {
  detectNearbyPlayers,
};