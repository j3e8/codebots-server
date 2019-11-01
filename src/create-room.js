const Room = require('./room');

module.exports = function createRoom(env, player, msg) {
  console.log('createRoom');
  let room = new Room(env);
  env.rooms.push(room);
  player.setRoom(room);
  room.addPlayer(player, true);
  if (player.socket) {
    player.socket.emit('createRoom', Object.assign({ me: player.getPlayerData() }, room.getRoomData()));
  }
}
