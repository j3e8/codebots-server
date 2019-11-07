module.exports = function(callback) {
  let bot = this;

  setTimeout(() => {
    let results = {
      bots: bot.match.bots.map((b) => {
        return {
          id: b.id,
          hp: b.hp,
          location: {
            x: b.location.x,
            y: b.location.y,
          },
          rotation: b.rotation,
          velocity: b.velocity,
        }
      }),
      bullets: bot.match.bullets.map((b) => {
        return {
          damage: b.damage,
          location: {
            x: b.location.x,
            y: b.location.y,
          },
          angle: b.angle,
          velocity: b.velocity,
        };
      }),
    }
    callback(results);
  }, bot.scanDuration);
}
