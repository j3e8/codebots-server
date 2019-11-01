const config = require('config');
const Bot = require('./bot');
const Player = require('./player');
const generateScript = require('./generate-script');
const generateUsername = require('./generate-username');

module.exports = function selectBot(env, player, msg) {
  let id = Math.floor(Math.random() * 10000000).toString();

  // write the script to tmp directory
  let dir = config.get('tmpdir');
  let scriptPath = `${dir}/${id}.compiled.js`;
  let srcPath = `${dir}/${id}.js`

  return generateScript(scriptPath, srcPath, msg.script)
  .then(() => {
    let cmpPlayer = new Player(env, null);
    cmpPlayer.setUsername(generateUsername());
    player.room.addPlayer(cmpPlayer);

    // instantiate bot from script
    cmpPlayer.bot = new Bot(env, null, msg.name, scriptPath);

    // add bot to room
    player.room.addBot(cmpPlayer.bot);
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
