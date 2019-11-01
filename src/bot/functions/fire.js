const Bullet = require('../../bullet');

module.exports = function(callback) {
  if (!this.isLoaded) {
    console.log("can't fire. not loaded");
    if (callback) {
      callback(false);
    }
    return;
  }

  let b = new Bullet(this);
  console.log('fireBullet');
  this.fireBullet(b);
  if (callback) {
    callback(true);
  }
}
