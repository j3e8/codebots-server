class Player {
  constructor(env, socket) {
    this.id = env.nextId();
    this.bot = null;
    this.socket = socket;
    this.room = null;
    this.username = null;
  }

  getPlayerData() {
    return {
      id: this.id,
      username: this.username,
      bot: this.bot ? this.bot.getBotData() : null
    }
  }

  setRoom(room) {
    this.room = room;
  }

  setUsername(username) {
    this.username = username;
    console.log('setUsername', this.username);
  }
}

module.exports = Player;
