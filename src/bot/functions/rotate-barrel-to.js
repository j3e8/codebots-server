 const utils = require('./function-utils');

module.exports = function(degreeAngle, callback) {
  console.log('rotateBarrelTo');
  let ad = this.barrel.rotation / Math.PI * 180;
  let angle = utils.degreeToRadian(degreeAngle);

  // standardize angle to less than Math.PI away from this.barrel.rotation (shortest direction)
  while (angle < this.barrel.rotation - Math.PI) {
    angle += Math.PI*2;
  }
  while (angle > this.barrel.rotation + Math.PI) {
    angle -= Math.PI*2;
  }

  // set velocity (with sign for direction)
  this.barrel.rotationVelocity = this.barrel.maxRotationVelocity;
  if (angle < this.barrel.rotation) {
    this.barrel.rotationVelocity = -this.barrel.rotationVelocity;
  }

  // add the rotate instruction to the queue
  this.match.addInstruction({
    type: 'rotateBarrel',
    bot: this,
    fn: rotateBarrelTo.bind(this, angle)
  }, callback);
}

function rotateBarrelTo(angle, elapsedMs) {
  let r = this.barrel.rotationVelocity * elapsedMs;
  if ((this.barrel.rotation <= angle && this.barrel.rotation + r >= angle) || (this.barrel.rotation >= angle && this.barrel.rotation + r <= angle)) {
    this.barrel.rotationVelocity = 0;
    this.barrel.rotation = angle;

    this.barrel.rotation = utils.standardizeAngle(this.barrel.rotation);
    return { finished: true };
  }
  else {
    this.barrel.rotation += r;
  }
  return { finished: false };
}
