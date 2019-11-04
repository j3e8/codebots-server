module.exports = function(...args) {
  // broadcast the message to this bot's client
  this.owner.socket.emit('scriptLog', {
    bot: this.getBotData(),
    message: args,
  });
}
