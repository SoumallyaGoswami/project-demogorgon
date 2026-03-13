function assignRoles(players) {
  if (!Array.isArray(players) || players.length === 0) {
    return;
  }

  // Shuffle players in-place using Fisher–Yates
  for (let i = players.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = players[i];
    players[i] = players[j];
    players[j] = temp;
  }

  // Assign roles
  players.forEach((player, index) => {
    if (index === 0) {
      player.role = 'demogorgon';
    } else if (index === 1) {
      player.role = 'sheriff';
    } else {
      player.role = 'security';
    }
  });
}

module.exports = {
  assignRoles,
};
