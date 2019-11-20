module.exports = function(callback) {
  this.match.cancelInstruction({
    type: 'rotate',
    bot: this,
  });
  if (callback) {
    callback();
  }
}
