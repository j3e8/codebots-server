const { parentPort } = require('worker_threads');
const __bot = new UserBotClassName();
const __callbacks = {};

const MESSAGES_PER_SECOND = 50;
let messageHistory = [];

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

function prepareAndPostMessage(data, callback, err) {
  // console.log('prepareAndPostMessage begin');
  let guid = makeGuid();
  let _data = Object.assign({}, data, { guid: guid });

  let isPromise = callback ? false : true;

  if (isRateLimited(data)) {
    if (isPromise) {
      return Promise.reject("Rate limit");
    } else if (err) {
      err("Rate limit");
    }
    return;
  }

  if (isPromise) {
    return new Promise((resolve, reject) => {
      __callbacks[guid] = resolve;
      parentPort.postMessage(_data);
    })
    .catch((e) => {
      console.error(`Worker promise error`, data, e);
      parentPort.postMessage({
        error: e.toString(),
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

function isRateLimited(data) {
  messageHistory.push({
    data,
    time: new Date().getTime(),
  });
  const oneSecondAgo = new Date().getTime() - 1000;
  messageHistory = messageHistory.filter(m => m.time >= oneSecondAgo);
  if (messageHistory.length > MESSAGES_PER_SECOND) {
    console.log('-- RATE LIMIT --', messageHistory);
    return true;
  }
  return false;
}
