class Mine {
  constructor(owner) {
    this.owner = owner;
    this.damage = 35;
    this.width = 1.4;
    this.height = 1.4;
    const ownerRadius = Math.max(owner.width, owner.height) / 2;
    const mineRadius = Math.max(this.width, this.height) / 2;
    this.location = {
      x: owner.location.x - Math.cos(owner.rotation) * (ownerRadius + mineRadius) * 1.0,
      y: owner.location.y - Math.sin(owner.rotation) * (ownerRadius + mineRadius) * 1.0,
    };
  }

  animateFrame(elapsedMs) {
  }

  getStatus() {
    return {
      width: this.width,
      height: this.height,
      location: {
        x: this.location.x,
        y: this.location.y,
      },
      damage: this.damage,
      ownerId: this.owner.id,
    }
  }

  hitTestBullet(bullet)  {
    let pt = bullet.location;
    let sqd = (pt.x - this.location.x)*(pt.x - this.location.x) + (pt.y - this.location.y)*(pt.y - this.location.y);
    const r = this.width / 2;
    if (sqd <= r * r)  {
      return true;
    }
    return false;
  }
}

module.exports = Mine;
