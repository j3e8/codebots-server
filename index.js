require('dotenv').config();

if (!process.env.PORT) {
  console.error("\nCouldn't start server. Missing PORT env variable\n");
  process.exit(1);
}

// instantiate a socket listener
const io = require('socket.io')();

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
const selectBot = require('./src/select-bot');
const selectCmpBot = require('./src/select-cmp-bot');
const startMatch = require('./src/start-match');
const stopMatch = require('./src/stop-match');

// animation loop
function animateFrame() {
  env.matches.forEach((m) => {
    m.animateFrame();
    m.room.players.forEach((c) => {
      if (c.socket) {
        c.socket.emit('status', m.getStatus());
      }
    })
  });
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
  socket.on('selectBot', selectBot.bind(this, env, player));
  socket.on('selectCmpBot', selectCmpBot.bind(this, env, player));
  socket.on('startMatch', startMatch.bind(this, env, player));
  socket.on('stopMatch', stopMatch.bind(this, env, player));
});
io.listen(process.env.PORT);
