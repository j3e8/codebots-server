const { Worker } = require('worker_threads');
const BotFunctions = require('./functions');
const MatchFunctions = require('../match/functions');
const ArenaFunctions = require('../arena/functions');
const getId = require('./get-id');

class Bot {
  constructor(env, owner, name, script) {
    this.id = getId();
    this.script = script;
    this.match = null;
    this.name = name;
    this.owner = owner;
    this.color = 'gray'; // set some default in case the script never does

    // Constants
    this.maxHp = 100;
    this.width = 3;
    this.height = 3.4054;
    this.maxVelocity = 0.015;
    this.maxRotationVelocity = 0.0004;
    this.timeBetweenBullets = 1000; // ms
    this.scanDuration = 400; // ms
    this.crashDamage = 1;
    this.isLoaded = false;

    this.subscribers = {};
  }

  accumulatePoints() {
    this.stats.cumulativePoints += this.stats.points;
  }

  emitScriptError(err) {
    console.error('Worker script error:', err);
    if (this.owner && this.owner.socket) {
      this.owner.socket.emit('scriptError', {
        botId: this.id,
        botName: this.name,
        error: err.toString(),
      });
    }
  }

  addSubscriber(operation, callback) {
    if (!this.subscribers[operation]) {
      this.subscribers[operation] = [];
    }
    if (callback) {
      this.subscribers[operation].push(callback);
    }
  }

  callSubscribers(operation, ...args) {
    const callbacks = this.subscribers[operation].splice(0, this.subscribers[operation].length);
    callbacks.forEach((cb) => cb(...args));
  }

  crashTest(bot) {
    // TODO
    let sqd = (bot.location.x - this.location.x)*(bot.location.x - this.location.x) + (bot.location.y - this.location.y)*(bot.location.y - this.location.y);
    let r1 = Math.min(this.width, this.height) / 2;
    let r2 = Math.min(bot.width, bot.height) / 2;
    let d = r1 + r2;
    if (sqd <= d * d) {
      return true;
    }
    return false;
  }

  doDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }

  onCrash(otherBot) {
    this.doDamage(otherBot.crashDamage * otherBot.velocity);
    this.revertMove();
    if (!this.alive) {
      return;
    }
    try {
      this.worker && this.worker.postMessage({
        fn: 'onCrash',
        args: [otherBot.getStatus()],
      });
    } catch (ex) { }
  }

  /* You died. This is who killed you */
  onDied(bot, bullet) {
    this.stats.killer = bot ? bot.getBotData() : null;
    const livingBots = this.match.room.bots.filter(b => b.alive);
    this.stats.rank = livingBots.length + 1;
    this.stats.points = (this.match.room.bots.length - this.stats.rank) + this.stats.kills;
    try {
      this.worker && this.worker.postMessage({
        fn: 'onDied',
        args: [bot.getStatus(), bullet ? bullet.getStatus() : undefined],
      });
    } catch (ex) { }
  }

  /* This bot's bullet hit another bot */
  onHit(bot, bullet) {
    this.stats.hits++;
    try {
      this.worker && this.worker.postMessage({
        fn: 'onHit',
        args: [bot.getStatus(), bullet.getStatus()],
      });
    } catch (ex) { }
  }

  /* You killed some other bot */
  onKill(bot, bullet) {
    this.stats.kills++;
    try {
      this.worker && this.worker.postMessage({
        fn: 'onKill',
        args: [bot.getStatus(), bullet ? bullet.getStatus() : undefined],
      });
    } catch (ex) { }
  }

  /* This bot was shot by another */
  onShot(bot, bullet) {
    this.doDamage(bullet.damage);
    if (!this.alive) {
      return;
    }
    try {
      this.worker && this.worker.postMessage({
        fn: 'onShot',
        args: [bot.getStatus(), bullet.getStatus()],
      });
    } catch (ex) { }
  }

  onWallBump() {
    this.doDamage(this.crashDamage * this.velocity);
    this.revertMove();
    if (!this.alive) {
      return;
    }
    try {
      this.worker && this.worker.postMessage({
        fn: 'onWallBump',
        args: [],
      });
    } catch (ex) { }
  }

  onWin() {
    this.stats.rank = 1;
    this.stats.points = (this.match.room.bots.length - 1) + this.stats.kills;
  }

  fireBullet(b) {
    this.stats.bulletsFired++;
    this.lastBulletFiredTime = new Date().getTime();
    this.isLoaded = false;
    this.match.fireBullet(b);
  }

  getBotData() {
    return {
      id: this.id,
      playerName: this.owner ? this.owner.name : 'Cmp',
      name: this.name,
      color: this.color,
      stats: this.stats,
      seized: this.seized,
    }
  }

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      location: this.location,
      rotation: this.rotation / Math.PI * 180,
      barrel: {
        height: this.barrel.height,
        length: this.barrel.length,
        width: this.barrel.width,
        rotation: this.barrel.rotation / Math.PI * 180,
        rotationVelocityPerMs: this.barrel.rotationVelocity / Math.PI * 180,
        maxRotationVelocityPerMs: this.barrel.maxRotationVelocity / Math.PI * 180,
      },
      color: this.color,
      hp: this.hp,
      alive: this.alive,
      seized: this.seized,
      maxHp: this.maxHp,
      velocityPerMs: this.maxVelocity,
      maxVelocityPerMs: this.maxVelocity,
      rotationVelocityPerMs: this.rotationVelocity / Math.PI * 180,
      maxRotationVelocityPerMs: this.maxRotationVelocity / Math.PI * 180,
      reloadTimeInMs: this.timeBetweenBullets,
      scanDurationInMs: this.scanDuration,
    }
  }

  hitTest(bullet) {
    if (bullet.owner == this) {
      return false;
    }
    let pt = bullet.location;
    let sqd = (pt.x - this.location.x)*(pt.x - this.location.x) + (pt.y - this.location.y)*(pt.y - this.location.y);
    let r = Math.min(this.width, this.height) / 2;
    if (sqd <= r * r) {
      return true;
    }
    return false;
  }

  prepareForMatch() {
    this.alive = true;
    this.seized = false;
    this.hp = 100;
    this.location = {
      x: 0,
      y: 0,
    };
    this.velocity = 0;
    this.rotation = 0;
    this.rotationVelocity = 0;
    this.barrel = {
      rotation: 0,
      rotationVelocity: 0,
      maxRotationVelocity: 0.0009,
      height: 1.541,
      width: 4.865,
      length: 2.2,
    };
    this.lastBulletFiredTime = 0; // timestamp

    this.stats = {
      hits: 0,
      bulletsFired: 0,
      kills: 0,
      killer: null,
      rank: null,
      points: 0,
      cumulativePoints: this.stats ? this.stats.cumulativePoints : 0,
    };

    this.setupWorker();
  }

  reload() {
    this.isLoaded = true;
  }

  resetCumulativePoints() {
    this.stats.cumulativePoints = 0;
  }

  revertMove() {
    if (this._previousLocation) {
      this.location = Object.assign({}, this._previousLocation);
    }
  }

  setMatch(m) {
    this.match = m;
  }

  setupWorker() {
    this.worker = new Worker(this.script, {
      execArgv: ['--unhandled-rejections=strict'],
    });

    try {
      this.worker && this.worker.postMessage({
        fn: 'init',
        args: [this.id, this.name],
      });
    } catch (ex) { }

    const callback = (guid, fn, retval) => {
      if (this.worker) {
        try {
          this.worker.postMessage({
            guid: guid,
            fn: fn,
            args: [ retval ]
          });
        } catch (ex) { }
      }
    }

    this.worker.on("message", (message) => {
      if (message.error) {
        this.emitScriptError(message.error);
      } else {
        const args = message.args.concat([ callback.bind(this, message.guid, message.fn) ]);
        if (message.obj == 'Bot' && BotFunctions[message.fn] && this.alive && this.worker) {
          BotFunctions[message.fn].apply(this, args);
        } else if (message.obj === 'Arena' && ArenaFunctions[message.fn] && this.worker) {
          ArenaFunctions[message.fn].apply(this.match.arena, args);
        } else if (message.obj === 'Match' && MatchFunctions[message.fn] && this.worker) {
          MatchFunctions[message.fn].apply(this.match, args);
        }
      }
    });

    this.worker.on("error", (err) => {
      console.log("this.worker.on('error')");
      try {
        this.emitScriptError(err);
        this.worker.terminate();
        this.seized = true;
      } catch(ex) {
        console.error("Couldn't terminate worker after error", ex);
      }
    });
  }
}

module.exports = Bot;
