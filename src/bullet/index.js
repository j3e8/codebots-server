class Bullet {
  constructor(owner) {
    this.owner = owner;
    this.damage = 10;
    this.width = 0.8;
    this.height = 0.8;
    this.angle = (owner.rotation + owner.barrel.rotation);
    this.location = {
      x: owner.location.x + Math.cos(this.angle) * owner.barrel.length,
      y: owner.location.y + Math.sin(this.angle) * owner.barrel.length
    }
    this.maxVelocity = 0.035;
    this.velocity = this.maxVelocity;
  }

  animateFrame(elapsedMs) {
    let d = this.velocity * elapsedMs;
    let x = Math.cos(this.angle) * d;
    let y = Math.sin(this.angle) * d;
    this.location.x += x;
    this.location.y += y;
  }

  getStatus() {
    return {
      width: this.width,
      height: this.height,
      location: {
        x: this.location.x,
        y: this.location.y,
      },
      velocity: this.velocity,
      angle: this.angle,
      damage: this.damage,
      ownerId: this.owner.id,
    }
  }
}

module.exports = Bullet;
