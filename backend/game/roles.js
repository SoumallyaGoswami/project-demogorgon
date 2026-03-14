function assignRoles(players) {

  if (!Array.isArray(players) || players.length === 0) return;

  // shuffle players
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }

  players.forEach((player, index) => {

    if (index === 0) {
      player.role = "demogorgon";
      player.hasBullet = false;
    }

    else if (index === 1) {
      player.role = "sheriff";
      player.hasBullet = true;
    }

    else {
      player.role = "security";
      player.hasBullet = false;
    }

  });

}

module.exports = { assignRoles };