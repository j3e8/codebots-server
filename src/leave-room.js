module.exports = function leaveRoom(env, player, msg) {
  console.log('leaveRoom', msg, env.rooms);

  if (!player.room) {
    return;
  }

  let room = env.rooms.find((r) => r.guid == player.room.guid);
  if (!room) {
    return;
  }
  room.removePlayer(player);
  player.socket.emit('leftRoom');
  room.players.forEach((p) => {
    if (p.id != player.id && p.socket) {
      p.socket.emit('memberLeft', room.getRoomData());
    }
  });
}
