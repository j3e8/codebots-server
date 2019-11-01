module.exports = function stopMatch(env, player) {
  // find player's match by room
  const match = env.matches.find(m => m.room.guid === player.room.guid);
  if (!match) {
    return;
  }
  match.endMatch(false);

  // remove match from the server's environment
  env.matches.splice(env.matches.indexOf(match), 1);
}
