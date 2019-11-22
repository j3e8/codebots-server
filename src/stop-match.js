module.exports = function stopMatch(env, player) {
  // find player's match by room
  const match = env.matches.find(m => m.room.guid === player.room.guid);
  if (!match) {
    return;
  }
  match.endMatch(false);

  // the match will have its workers terminated and will be properly removed from the server on the next cycle of the event loop
}
