module.exports = function(callback) {
  this.match.cancelInstruction({
    type: 'rotateBarrel',
    bot: this,
  });
  if (callback) {
    callback();
  }
}
