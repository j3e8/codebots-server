module.exports = function(...args) {
  const argsToLog = args.slice(0, args.length - 1);
  const callback = args[args.length - 1];

  // broadcast the message to this bot's client
  try {
    this.owner && this.owner.socket && this.owner.socket.emit('scriptLog', {
      bot: this.getBotData(),
      message: args,
    });
  } catch (ex) {
    console.error('Error in logging', ex);
  }

  callback();
}
