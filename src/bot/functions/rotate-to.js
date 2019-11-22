const utils = require('./function-utils');

module.exports = function(degreeAngle, callback) {
  let ad = this.rotation / Math.PI * 180;
  let angle = utils.degreeToRadian(degreeAngle);

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
  if ((this.rotation <= angle && this.rotation + r >= angle) || (this.rotation >= angle && this.rotation + r <= angle)) {
    this.rotationVelocity = 0;
    this.rotation = angle;

    this.rotation = utils.standardizeAngle(this.rotation);
    return { finished: true };
  }
  else {
    this.rotation += r;
    this.rotation = utils.standardizeAngle(this.rotation);
  }
  return { finished: false };
}
