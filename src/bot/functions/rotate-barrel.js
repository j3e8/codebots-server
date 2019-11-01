const rotateBarrelTo = require('./rotate-barrel-to');

module.exports = function(degrees, callback) {
  console.log('rotateBarrel');
  let ad = this.barrel.rotation / Math.PI * 180;
  let angle = ad + degrees;
  rotateBarrelTo.call(this, angle, callback);
}
