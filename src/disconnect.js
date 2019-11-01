module.exports = function disconnect(env, player, msg) {
  console.log('disconnect');
  if (player && player.room) {
    player.room.removePlayer(player);
    player.room.players.forEach((c) => {
      console.log('emit memberLeft');
      if (c.socket) {
        c.socket.emit('memberLeft', player.room.getRoomData());
      }
    });
    if (!player.room.hasPlayers()) {
      let found = env.rooms.find((r) => r.guid == player.room.guid);
      env.rooms.splice(env.rooms.indexOf(found), 1);
      delete player.room;
    }

    // TODO: if the player has a script, delete it from the /tmp folder

    delete player;
  }
}
