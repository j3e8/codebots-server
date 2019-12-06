module.exports = function(callback) {
  this.addSubscriber('scan', callback);

  if (this.isScanning) {
    return; // wait
  }

  this.isScanning = true;
  setTimeout(() => {
    this.isScanning = false;
    const bots = this.match.bots.map((b) => {
      return {
        id: b.id,
        hp: b.hp,
        location: {
          x: b.location.x,
          y: b.location.y,
        },
        rotation: b.rotation,
        velocity: b.velocity,
        alive: b.alive,
      }
    });
    bots.sort((a, b) => Math.random() < 0.5 ? -1 : 1);

    let results = {
      bots,
      bullets: this.match.bullets.map((b) => {
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
    this.callSubscribers('scan', results);
  }, this.scanDuration);
}
