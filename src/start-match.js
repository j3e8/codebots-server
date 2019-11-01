const Arena = require('./arena');
const Match = require('./match');

module.exports = function startMatch(env, player) {
  // create & start a match
  let arena = new Arena(env);
  let match = new Match(env, player.room, arena);
  match.startMatch(env);
}
