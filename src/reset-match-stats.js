module.exports = function resetMatchStats(env, player) {
  // find player's match by room
  const match = env.matches.find(m => m.room.guid === player.room.guid);
  if (!match) {
    return;
  }
  match.resetMatchStats();
}
