module.exports = function joinRoom(env, player, msg) {
  console.log('joinRoom', msg, env.rooms);
  let room = env.rooms.find((r) => r.guid == msg.guid);
  if (room) {
    console.log('found room');
    player.room = room;
    room.addPlayer(player, false);
    player.socket.emit('joinRoomSuccess', Object.assign({ me: player.getPlayerData() }, room.getRoomData()));
    room.players.forEach((p) => {
      if (p.id != player.id && p.socket) {
        p.socket.emit('memberJoined', room.getRoomData());
      }
    });
  }
  else {
    console.log('could not find room');
    if (player.socket) {
      player.socket.emit('joinRoomFail', false);
    }
  }
}
