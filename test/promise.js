class MyBot extends Bot {
  constructor() {
    super();
  }

  receiveMessage(msg) {
    console.log('i received a message from ', msg.bot);
  }

  init() {
    this.setColor(Bot.GREEN);
    this.broadcast('hello, world');
    console.log('init done');
  }

  start() {
    this.forward(20)
    .then(() => {
      console.log('went forward');
      return this.getRotation();
    })
    .then((r1) => {
      console.log('got rotation', r1);
      return this.rotate(20);
    })
    .then(() => this.rotateBarrel(-20))
  }
}
