module.exports = function(callback) {
  callback(this.bots.map(bot => bot.getBotData()));
}
