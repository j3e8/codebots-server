const generateGuid = require('./generate-guid');

class Room {
  constructor(env) {
    let guid;
    do {
      guid = generateGuid();
    } while (env.rooms.find((r) => r.guid == guid));

    this.guid = guid;
    this.bots = [];
    this.players = [];
    this.owner = null;
  }

  addBot(bot) {
    this.bots.push(bot);
    bot.room = this;
  }

  addPlayer(player, isRoomOwner) {
    this.players.push(player);
    if (isRoomOwner) {
      this.owner = player;
    }
  }

  getRoomData() {
    return {
      guid: this.guid,
      owner: this.owner.getPlayerData(),
      players: this.players.map((c) => c.getPlayerData())
    }
  }

  hasPlayers() {
    return this.players.length ? true : false;
  }

  removePlayer(player) {
    let found = this.players.find((c) => c.id == player.id);
    if (found) {
      this.players.splice(this.players.indexOf(found), 1);
    }
  }
}

module.exports = Room;
