const { Worker } = require('worker_threads');
const BotFunctions = require('./functions');
const getId = require('./get-id');

class Bot {
  constructor(env, owner, name, script) {
    this.id = getId();
    this.alive = true;
    this.name = name;
    this.owner = owner;
    this.match = null;
    this.worker = new Worker(script);
    this.hp = 100;
    this.maxHp = 100;
    this.width = 3;
    this.height = 3.4054;
    this.location = {
      x: 0,
      y: 0,
    };
    this.velocity = 0;
    this.maxVelocity = 0.015;
    this.rotation = 0;
    this.rotationVelocity = 0;
    this.maxRotationVelocity = 0.0004;
    this.barrel = {
      rotation: 0,
      rotationVelocity: 0,
      maxRotationVelocity: 0.0009,
      height: 1.541,
      width: 4.865,
      length: 2.2,
    };
    this.timeBetweenBullets = 1000; // ms
    this.lastBulletFiredTime = 0; // timestamp
    this.scanDuration = 400; // ms
    this.crashDamage = 1;
    this.isLoaded = false;

    this.worker.postMessage({
      fn: 'init',
      args: [this.id, this.name],
    });

    const callback = (guid, fn, retval) => {
      this.worker.postMessage({
        guid: guid,
        fn: fn,
        args: [ retval ]
      });
    }

    this.worker.on("message", (message) => {
      if (message.error) {
        console.log('emitScriptError');
        this.emitScriptError(message.error);
      } else {
        const args = message.args.concat([ callback.bind(this, message.guid, message.fn) ]);
        if (message.obj == 'Bot' && BotFunctions[message.fn] && this.alive) {
          console.log(`calling BotFunctions[${message.fn}]`);
          BotFunctions[message.fn].apply(this, args);
        }
      }
    });

    this.worker.on("error", (err) => {
      this.emitScriptError(err);
    });
  }

  emitScriptError(err) {
    console.error('Worker script error:', err);
    this.owner.socket.emit('scriptError', {
      botId: this.id,
      botName: this.name,
      error: err.toString(),
    });
  }

  crashTest(bot) {
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

  fireBullet(b) {
    this.lastBulletFiredTime = new Date().getTime();
    this.isLoaded = false;
    this.match.fireBullet(b);
  }

  getBotData() {
    return {
      id: this.id,
      name: this.name,
      color: this.color
    }
  }

  getStatus() {
    return {
      id: this.id,
      width: this.width,
      height: this.height,
      location: this.location,
      rotation: this.rotation,
      barrel: this.barrel,
      color: this.color,
      hp: this.hp,
      maxHp: this.maxHp,
      alive: this.alive
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

  reload() {
    console.log('reload');
    this.isLoaded = true;
  }

  revertMove() {
    if (this._previousLocation) {
      this.location = Object.assign({}, this._previousLocation);
    }
  }

  setMatch(m) {
    this.match = m;
  }
}

module.exports = Bot;
