const config = require('config');
const Bot = require('./bot');
const generateScript = require('./generate-script');

module.exports = function selectBot(env, player, msg) {
  // write the script to tmp directory
  let dir = config.get('tmpdir');
  let scriptPath = `${dir}/${player.id}.compiled.js`;
  let srcPath = `${dir}/${player.id}.js`

  return generateScript(scriptPath, srcPath, msg.script)
  .then(() => {
    if (player.bot) {
      player.room.removeBot(player.bot);
    }
    // instantiate bot from script
    player.bot = new Bot(env, player, msg.name, scriptPath);
    // add bot to room
    player.room.addBot(player.bot);
    let roomData = player.room.getRoomData();
    player.room.players.forEach((pl) => {
      if (pl.socket) {
        pl.socket.emit('selectBotSuccess', roomData);
      }
    });
  })
  .catch((ex) => {
    console.error("Couldn't load bot", ex);
    if (player.socket) {
      player.socket.emit('selectBotFail', { playerId: player.id });
    }
  })
}
