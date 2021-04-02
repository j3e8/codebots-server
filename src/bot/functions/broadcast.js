module.exports = function(msgstring, callback) {
  let thisBot = this;

  let envelope = {
    bot: this.id,
    message: msgstring
  }

  // broadcast the message to each bots' worker thread
  this.match.bots.forEach((bot) => {
    if (bot.id != thisBot.id) {
      bot.worker.postMessage({
        fn: 'receiveMessage',
        args: [ envelope ]
      });
    }
  });

  // broadcast the message to each players' socket too
  this.match.room.players.forEach((player) => {
    if (player.socket) {
      player.socket.emit('broadcast', {
        bot: thisBot.getBotData(),
        message: msgstring
      });
    }
  });

  callback();
}
