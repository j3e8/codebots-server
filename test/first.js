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
