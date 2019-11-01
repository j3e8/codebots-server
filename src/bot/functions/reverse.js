module.exports = function(distance, callback) {
  let bot = this;
  bot.velocity = -bot.maxVelocity;
  bot.__distanceTraveled = 0;
  bot.match.addInstruction({
    type: 'move',
    bot: bot,
    fn: reverse.bind(bot, -distance)
  }, callback);
}

function reverse(distance, elapsedMs) {
  let d = this.velocity * elapsedMs;
  this.location.x += Math.cos(this.rotation) * d;
  this.location.y += Math.sin(this.rotation) * d;
  this.__distanceTraveled += d;
  if (Math.abs(this.__distanceTraveled) >= Math.abs(distance)) {
    this.velocity = 0;
    return { finished: true };
  }
  return { finished: false };
}
