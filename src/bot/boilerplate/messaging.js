const { parentPort } = require('worker_threads');
const __bot = new UserBotClassName();
const __callbacks = {};

parentPort.on('message', (message) => {
  // console.log('receiveMessage', JSON.stringify(message, null, 2));
  if (message.guid) { // this is a callback from webworker-initiated communication
    if (__callbacks[message.guid]) {
      // console.log('fire callback', message.args);
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
  // console.log('prepareAndPostMessage begin');
  let guid = makeGuid();
  let _data = Object.assign({}, data, { guid: guid });

  let isPromise = callback ? false : true;
  if (isPromise) {
    return new Promise((resolve, reject) => {
      __callbacks[guid] = resolve;
      parentPort.postMessage(_data);
    })
    .catch((err) => {
      console.error(`Worker promise error`, data, err);
      parentPort.postMessage({
        error: err.toString(),
      });
    });
  }
  else {
    __callbacks[guid] = callback;
    parentPort.postMessage(_data);
  }
  // console.log('prepareAndPostMessage done');
}

const validChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
function makeGuid() {
  let str = '';
  while (str.length < 12) {
    str += validChars[Math.floor(Math.random()*validChars.length)];
  }
  return str;
}
