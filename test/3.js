const { parentPort } = require('worker_threads');
console.log('3.js');

// const Arena = require('arena')
const Arena = {
  getDimensions: (cb) => {
    prepareAndPostMessage({
      obj: 'Arena',
      fn: 'getDimensions',
      args: []
    }, cb);
  }
}

// const Match = require('match')
const Match = {
  getBots: (cb) => {
    prepareAndPostMessage({
      obj: 'Match',
      fn: 'getBots',
      args: []
    }, cb);
  }
}

// const Bot = require('bot')
class Bot {
  constructor() { }

  broadcast(msg) {
    prepareAndPostMessage({
      obj: 'Bot',
      fn: 'broadcast',
      args: [msg]
    });
    console.log('Bot.broadcast done');
  }

  forward(d, cb) {
    console.log('Bot.forward', d);
    prepareAndPostMessage({
      obj: 'Bot',
      fn: 'forward',
      args: [d]
    }, cb);
    console.log('Bot.forward end');
  }

  getRotation(cb) {
    console.log('Bot.getRotation');
    prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getRotation',
      args: []
    }, cb);
  }

  reverse(d, cb) {
    prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reverse',
      args: [d]
    }, cb);
  }

  rotate(d, cb) {
    prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotate',
      args: [d]
    }, cb);
  }

  rotateTo(d, cb) {
    prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateTo',
      args: [d]
    }, cb);
  }
}

// bot code
class MyBot extends Bot {
  constructor() {
    super();
  }

  receiveMessage(msg) {
    console.log('i received a message from ', msg.bot);
  }

  init() {
    this.broadcast('hello, world');
    console.log('init done');
  }

  start() {
    console.log('start begin');
    this.forward(20, () => {
      console.log('moved.');
    });
    this.getRotation((r1) => {
      console.log(r1);
      this.rotate(20, () => {
        console.log('rotated.');
        this.getRotation((r2) => console.log(r2));
      });
    });
    console.log('start done');
  }
}


// auto-injected code
let __bot = new MyBot();
let __callbacks = {};

parentPort.on('message', (message) => {
  console.log('3.js receiveMessage', JSON.stringify(message, null, 2));
  if (message.guid) { // this is a callback from webworker-initiated communication
    if (__callbacks[message.guid]) {
      __callbacks[message.guid].apply(__bot, message.args);
      delete __callbacks[message.guid];
    }
  }
  else if (message.fn) { // this is a standard server-initiated communication
    if (__bot[message.fn]) {
      __bot[message.fn].apply(__bot, message.args);
    }
  }
});

function prepareAndPostMessage(data, callback) {
  console.log('prepareAndPostMessage begin');
  let guid = makeGuid();
  console.log(guid);
  __callbacks[guid] = callback;
  let _data = Object.assign({}, data, { guid: guid });
  parentPort.postMessage(_data);
  console.log('prepareAndPostMessage done');
}

const validChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
function makeGuid() {
  let str = '';
  while (str.length < 12) {
    str += validChars[Math.floor(Math.random()*validChars.length)];
  }
  return str;
}
