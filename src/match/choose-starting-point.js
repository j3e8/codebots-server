const isTouchingOtherBot = require('./is-touching-other-bot');

module.exports = function chooseStartingPoint(arena, bot, bots) {
  let pt = {};
  do {
    pt.x = Math.random() * (arena.width - bot.width * 2) + bot.width;
    pt.y = Math.random() * (arena.height - bot.height * 2) + bot.height;
  } while (isTouchingOtherBot(pt, bots));

  return pt;
}
