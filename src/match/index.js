const chooseStartingPoint = require('./choose-starting-point');
const processAction = require('./process-action');
const cancelInstructionsOfType = require('./cancel-instructions-of-type');

class Match {
  constructor(env, room, arena) {
    this.instructionQueue = [];
    this.arena = arena;
    this.bots = room.bots;
    this.bullets = [];
    this.room = room;
    this.ended = false;
  }

  addInstruction(obj, callback) {
    cancelInstructionsOfType.call(this, obj.bot, obj.type);
    this.instructionQueue.push({
      bot: obj.bot,
      instruction: obj.fn,
      type: obj.type,
      callback: callback
    });
  }

  animateFrame() {
    if (this.ended) {
      return;
    }

    let thisFrame = new Date().getTime();
    if (!this.lastFrame) {
      this.lastFrame = thisFrame;
      return;
    }

    // set previousLocation for all bots in case they collide and we need to revert their location
    for (let a=0; a < this.bots.length; a++) {
      this.bots[a]._previousLocation = Object.assign({}, this.bots[a].location);
    }

    // calculate elapsed time and process instructions in the queue
    let elapsedMs = thisFrame - this.lastFrame;
    this.instructionQueue.forEach((instr) => {
      processAction.call(this, instr, elapsedMs);
    });

    // collision detection between bots
    for (let a=0; a < this.bots.length; a++) {
      for (let b=0; b < this.bots.length; b++) {
        if (a == b) {
          continue;
        }
        if (this.bots[a].crashTest(this.bots[b])) {
          this.bots[a].onCrash(this.bots[b]);
          this.bots[b].onCrash(this.bots[a]);
        }
      }
    }

    // collision detection with arena walls
    for (let a=0; a < this.bots.length; a++) {
      if (this.bots[a].location.x <= 0 + this.bots[a].width / 2
        || this.bots[a].location.y <= 0 + this.bots[a].height / 2
        || this.bots[a].location.x >= this.arena.width - this.bots[a].width / 2
        || this.bots[a].location.y >= this.arena.height - this.bots[a].height / 2
      ) {
        this.bots[a].onWallBump();
      }
    }

    // animate bullets
    for (let i=0; i < this.bullets.length; i++) {
      let bul = this.bullets[i];
      bul.animateFrame(elapsedMs);

      // remove off-screen bullets
      if (bul.location.x < 0 || bul.location.x > this.arena.width || bul.location.y < 0 || bul.location.y > this.arena.height) {
        this.bullets.splice(i, 1);
        i--;
        continue;
      }
    }

    // collision detection between bullet and bot
    for (let i=0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      for (let j=0; j < this.bots.length; j++) {
        let bot = this.bots[j];
        if (bot.hitTest(bullet)) {
          bot.onShot(bullet); // react to being shot
          bullet.owner.onHit(bot, bullet); // acknowledge that you hit someone
          this.bullets.splice(i, 1);
          i--;
          break; // break out of the bot loop
        }
      }
    }

    // test if the match is over
    let aliveBots = this.bots.filter((b) => b.alive);
    if (aliveBots.length <= 1) {
      this.endMatch(true);
    }

    this.lastFrame = thisFrame;
  }

  endMatch(finished) {
    console.log('endMatch');
    this.ended = true;
    this.endTime = new Date().getTime();
    const winner = finished ? this.bots.find(b => b.alive) : null;
    this.room.players.forEach((player) => {
      if (player.socket) {
        player.socket.emit('matchEnded', {
          results: {
            status: finished ? 'finished' : 'canceled',
            winner: winner ? winner.getBotData() : null,
          },
        });
      }
      if (player.bot.alive) {
        player.bot.worker.postMessage({
          fn: 'end',
          args: [],
        });
      }
    });
  }

  fireBullet(bullet) {
    this.bullets.push(bullet);
  }

  getStatus() {
    return {
      arena: this.arena.getStatus(),
      bots: this.bots.map((b) => b.getStatus()),
      bullets: this.bullets.map((b) => b.getStatus()),
      elapsedTime: (this.endTime || new Date().getTime()) - this.startTime
    }
  }

  startMatch(env) {
    this.ended = false;
    this.startTime = new Date().getTime();
    this.endTime = null;
    this.bots.forEach((bot, i) => {
      bot.setMatch(this);
      bot.location = chooseStartingPoint(this.arena, bot, this.bots.slice(0, i));
      bot.rotation = Math.random() * Math.PI * 2;

      bot.worker.postMessage({
        fn: 'start',
        args: []
      });
    });
    env.matches.push(this);
    this.room.players.forEach((player) => {
      if (player.socket) {
        player.socket.emit('matchStarted', this.room.getRoomData());
      }
    })
  }
}

module.exports = Match;
