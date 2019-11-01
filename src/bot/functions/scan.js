module.exports = function(callback) {
  let bot = this;

  setTimeout(() => {
    let results = {
      bots: bot.match.bots.map((b) => {
        return {
          id: b.id,
          location: {
            x: b.location.x,
            y: b.location.y,
            rotation: b.rotation,
            velocity: b.velocity
          }
        }
      })
    }
    callback(results);
  }, bot.scanDuration);
}
