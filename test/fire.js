class MyBot extends Bot {
  constructor() {
    super();
  }

  init() {
    console.log('init');
    this.setColor(Bot.BLUE);
  }

  start() {
    console.log('start');
    this.rotateAndFire();
  }

  rotateAndFire() {
    console.log('rotateAndFire');
    Promise.all([
      this.reload(),
      this.rotateBarrel(30)
    ])
    .then(() => this.fire())
    .then(() => this.rotateAndFire())
    console.log('END rotateAndFire');
  }

}
