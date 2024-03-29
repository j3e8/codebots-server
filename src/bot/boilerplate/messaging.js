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

function prepareAndPostMessage(data) {
  // console.log('prepareAndPostMessage begin');
  let guid = makeGuid();
  let _data = Object.assign({}, data, { guid: guid });

  if (isRateLimited()) {
    return Promise.reject("Rate limit");
  }

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

function isRateLimited() {
  messageHistory.push({
    time: new Date().getTime(),
  });

  if (messageHistory.length <= MESSAGES_PER_SECOND) {
    return false;
  }

  // Trim the array down to only MESSAGES_PER_SECOND + 1 in length because nothing else matters
  messageHistory = messageHistory.slice(messageHistory.length - (MESSAGES_PER_SECOND + 1));

  // Check the (MESSAGES_PER_SECOND + 1)th most recent message. If it's within the last second we've hit the rate limit
  const oneSecondAgo = new Date().getTime() - 1000;
  if (messageHistory[messageHistory.length - (MESSAGES_PER_SECOND + 1)].time >= oneSecondAgo) {
    console.log('-- RATE LIMIT --', messageHistory);
    return true;
  }

  return false;
}
