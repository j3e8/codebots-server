module.exports = function(degreeAngle, callback) {
  let ad = this.rotation / Math.PI * 180;
  let angle = degreeAngle/180 * Math.PI;

  // standardize angle to less than Math.PI away from this.rotation (shortest direction)
  while (angle < this.rotation - Math.PI) {
    angle += Math.PI*2;
  }
  while (angle > this.rotation + Math.PI) {
    angle -= Math.PI*2;
  }

  // set velocity (with sign for direction)
  this.rotationVelocity = this.maxRotationVelocity;
  if (angle < this.rotation) {
    this.rotationVelocity = -this.rotationVelocity;
  }

  // add the rotate instruction to the queue
  this.match.addInstruction({
    type: 'rotate',
    bot: this,
    fn: rotateTo.bind(this, angle)
  }, callback);
}

function rotateTo(angle, elapsedMs) {
  let r = this.rotationVelocity * elapsedMs;
  if ((this.rotation < angle && this.rotation + r >= angle) || (this.rotation > angle && this.rotation + r <= angle)) {
    this.rotationVelocity = 0;
    this.rotation = angle;

    // standardize angle to between 0 and Math.PI*2
    while (this.rotation > Math.PI*2) {
      this.rotation -= Math.PI*2;
    }
    while (this.rotation < 0) {
      this.rotation += Math.PI*2;
    }

    return { finished: true };
  }
  else {
    this.rotation += r;
  }
  return { finished: false };
}
