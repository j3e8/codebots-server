const config = require('config');
const fs = require( 'fs' );
const https = require('https');

if (!config.has('port')) {
  console.error("\nCouldn't start server. Missing PORT env variable\n");
  process.exit(1);
}

// instantiate a socket listener
let io;
if (config.has('https')) {
  const app = require('express')();
  const server = https.createServer({
    key: fs.readFileSync(config.get('https').ssl_key),
    cert: fs.readFileSync(config.get('https').ssl_cert),
    requestCert: false,
    rejectUnauthorized: false
  }, app);
  server.listen(config.get('port'));
  io = require('socket.io').listen(server);
} else {
  io = require('socket.io')();
  io.listen(config.get('port'));
}


const env = {
  startTime: new Date(),
  matches: [],
  rooms: [],
  id: 1000,
  nextId: function() {
    this.id++;
    return this.id;
  }
}

const Player = require('./src/player');

const disconnect = require('./src/disconnect');
const setUsername = require('./src/set-username');
const createRoom = require('./src/create-room');
const joinRoom = require('./src/join-room');
const leaveRoom = require('./src/leave-room');
const selectBot = require('./src/select-bot');
const selectCmpBot = require('./src/select-cmp-bot');
const startMatch = require('./src/start-match');
const stopMatch = require('./src/stop-match');
const resetMatchStats = require('./src/reset-match-stats');

function emitStatus(socket, status) {
  if (!socket) {
    return;
  }
  socket.emit('status', status);
}

function animateMatches(matches) {
  for (let i=0; i < matches.length; i++) {
    const m = matches[i];

    // see if this match should still be active
    const activeSocket = m.room.players.find(p => p.socket);
    if (!activeSocket) {
      console.log('No active sockets');
      m.endMatch();
    }

    if (m.ended) {
      console.log('terminate workers');
      m.room.players.forEach((player) => {
        if (player.bot) {
          player.bot.worker.terminate()
          player.bot.worker = null;
        }
      });
      console.log('splice that match');
      matches.splice(i, 1);
      i--;
    } else {
      m.animateFrame();
      m.room.players.map(p => emitStatus(p.socket, m.getStatus()));
    }
  }
}

// animation loop
function animateFrame() {
  animateMatches(env.matches);
  setTimeout(animateFrame, 20);
}
setTimeout(animateFrame, 20);

io.on('connection', function(socket) {
  console.log('new socket player');
  let player = new Player(env, socket);

  socket.emit('connection', player.id);

  socket.on('disconnect', disconnect.bind(this, env, player));
  socket.on('setUsername', setUsername.bind(this, env, player));
  socket.on('createRoom', createRoom.bind(this, env, player));
  socket.on('joinRoom', joinRoom.bind(this, env, player));
  socket.on('leaveRoom', leaveRoom.bind(this, env, player));
  socket.on('selectBot', selectBot.bind(this, env, player));
  socket.on('selectCmpBot', selectCmpBot.bind(this, env, player));
  socket.on('startMatch', startMatch.bind(this, env, player));
  socket.on('stopMatch', stopMatch.bind(this, env, player));
  socket.on('resetMatchStats', resetMatchStats.bind(this, env, player));
});
