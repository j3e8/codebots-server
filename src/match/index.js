const chooseStartingPoint = require('./choose-starting-point');
const processAction = require('./process-action');
const cancelInstructionsOfType = require('./cancel-instructions-of-type');

class Match {
  constructor(env, room, arena) {
    this.arena = arena;
    this.room = room;
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
          let botAlive = this.bots[a].alive;
          this.bots[a].onCrash(this.bots[b]);
          if (botAlive !== this.bots[a].alive) {
            this.bots[a].onDied(this.bots[b]);
            this.bots[b].onKill(this.bots[a]);
          }
          botAlive = this.bots[b].alive;
          this.bots[b].onCrash(this.bots[a]);
          if (botAlive !== this.bots[b].alive) {
            this.bots[b].onDied(this.bots[a]);
            this.bots[a].onKill(this.bots[b]);
          }
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

    // collision between bots and mines
    for (let m=0; m < this.mines.length; m++) {
      const mine = this.mines[m];
      for (let b=0; b < this.bots.length; b++) {
        if (this.bots[b].hitTestMine(mine)) {
          let botAlive = this.bots[b].alive;
          this.bots[b].onBlastedWithMine(mine.owner, mine);
          mine.owner.onMineDetonated(mine, this.bots[b], null);
          if (botAlive !== this.bots[b].alive) {
            mine.owner.onKill(this.bots[b], null, mine);
            this.bots[b].onDied(mine.owner, null, mine);
          }
          this.mines.splice(m, 1);
          m--;
          break;
        }
      }
    }

    // collision between bullets and mines
    for (let m=0; m < this.mines.length; m++) {
      const mine = this.mines[m];
      for (let b=0; b < this.bullets.length; b++) {
        if (mine.hitTestBullet(this.bullets[b])) {
          this.bullets.splice(b, 1);
          this.bullets[b].owner.onHitMine(this.bullets[b], mine);
          mine.owner.onMineDetonated(mine, null, this.bullets[b]);
          this.mines.splice(m, 1);
          m--;
          break;
        }
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
          let botAlive = bot.alive;
          bot.onShot(bullet.owner, bullet); // react to being shot
          if (botAlive) {
            bullet.owner.onHit(bot, bullet); // acknowledge that you hit someone
          }
          if (botAlive !== bot.alive) {
            bot.onDied(bullet.owner, bullet);
            bullet.owner.onKill(bot, bullet); // acknowledge the kill
          }
          this.bullets.splice(i, 1);
          i--;
          break; // break out of the bot loop
        }
      }
    }

    // test if the match is over
    let aliveBots = this.bots.filter((b) => b.alive);
    if (aliveBots.length <= 1) {
      aliveBots.forEach(b => b.onWin());
      this.endMatch(true);
    }

    this.lastFrame = thisFrame;
  }

  cancelInstruction(obj) {
    cancelInstructionsOfType.call(this, obj.bot, obj.type);
  }

  endMatch(finished) {
    this.ended = true;
    this.endTime = new Date().getTime();
    const rankings = finished ? this.bots.map(b => b.getBotData()) : null;
    this.bots.forEach(bot => bot.accumulatePoints);

    this.room.players.forEach((player) => {
      if (player.socket) {
        player.socket.emit('matchEnded', {
          results: {
            status: finished ? 'finished' : 'canceled',
            rankings,
            elapsedTime: this.endTime - this.startTime,
          },
        });
      }
      if (player.bot && player.bot.worker) {
        try {
          player.bot.worker.postMessage({
            fn: 'end',
            args: [],
          });
        } catch (ex) { }
      }
    });
  }

  placeMine(mine) {
    this.mines.push(mine);
  }

  fireBullet(bullet) {
    this.bullets.push(bullet);
  }

  getStatus() {
    return {
      arena: this.arena.getStatus(),
      bots: this.bots.map((b) => b.getStatus()),
      bullets: this.bullets.map((b) => b.getStatus()),
      mines: this.mines.map((m) => m.getStatus()),
      elapsedTime: (this.endTime || new Date().getTime()) - this.startTime
    }
  }

  resetMatchStats() {
    this.room.bots.forEach(bot => bot.resetCumulativePoints())
  }

  startMatch(env) {
    this.instructionQueue = [];
    this.bots = this.room.bots;
    this.bots.forEach(bot => bot.prepareForMatch());
    this.bullets = [];
    this.mines = [];
    this.ended = false;

    this.startTime = new Date().getTime();
    this.endTime = null;
    this.bots.forEach((bot, i) => {
      bot.setMatch(this);
      bot.location = chooseStartingPoint(this.arena, bot, this.bots.slice(0, i));
      bot.rotation = Math.random() * Math.PI * 2;

      if (bot.worker) {
        try {
          bot.worker.postMessage({
            fn: 'start',
            args: []
          });
        } catch (ex) { }
      }
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
