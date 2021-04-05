const Mine = require('../../mine');

module.exports = function(callback) {
  if (!this.minesLeft) {
    if (callback) {
      callback(false);
    }
    return;
  }

  let b = new Mine(this);
  this.dropMine(b);
  if (callback) {
    callback(true);
  }
}
