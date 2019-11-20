module.exports = function(callback) {
  this.match.cancelInstruction({
    type: 'move',
    bot: this,
  });
  if (callback) {
    callback();
  }
}
