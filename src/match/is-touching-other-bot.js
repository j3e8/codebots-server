module.exports = function isTouchingOtherBot(pt, bots) {
  if (!bots || !bots.length) {
    return false;
  }
  let touching = bots.find((bot) => {
    let botsize = Math.max(bot.height, bot.width);
    let d = Math.sqrt((bot.location.x - pt.x)*(bot.location.x - pt.x) + (bot.location.y - pt.y)*(bot.location.y - pt.y));
    if (d < botsize/2) {
      return true;
    }
    return false;
  });
  return touching ? true : false;
}
