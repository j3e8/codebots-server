const rotateTo = require('./rotate-to');

module.exports = function(degrees, callback) {
  let ad = this.rotation / Math.PI * 180;
  let angle = ad + degrees;
  rotateTo.call(this, angle, callback);
}
