const { calculateDistance } = require('../utils/distance');

function isInsideArena(position, arena) {
  if (
    !position ||
    !arena ||
    !arena.center ||
    typeof arena.radius !== 'number'
  ) {
    return false;
  }

  const { x, y } = position;
  const { center, radius } = arena;

  const distance = calculateDistance(x, y, center.x, center.y);
  return distance <= radius;
}

module.exports = {
  isInsideArena,
};
