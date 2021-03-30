class Bot {
  static get GREEN() { return 'green'; }
  static get BLUE() { return 'blue'; }
  static get GRAY() { return 'gray'; }
  static get TAN() { return 'tan'; }
  static get RED() { return 'red'; }
  static get ORANGE() { return 'orange'; }
  static get PINK() { return 'pink'; }
  static get PURPLE() { return 'purple'; }

  constructor() {
    // fun little overrides
    console.info = this.log;
    console.log = this.log;
    console.warn = this.log;
    console.error = this.log;
    console.trace = () => this.log("console.trace is not allowed in Bot worker class");
  }

  broadcast(msg) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'broadcast',
      args: [msg]
    });
  }

  log(...args) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'log',
      args: [...args]
    });
  }

  fire() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'fire',
      args: []
    });
  }

  forward(d) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'forward',
      args: [d]
    });
  }

  getBarrelRotation() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getBarrelRotation',
      args: []
    });
  }

  getLocation() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getLocation',
      args: []
    });
  }

  getRotation() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getRotation',
      args: []
    });
  }

  getStatus() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getStatus',
      args: []
    });
  }

  reload() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reload',
      args: []
    });
  }

  reverse(d) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reverse',
      args: [d]
    });
  }

  rotate(d) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotate',
      args: [d]
    });
  }

  rotateBarrel(d) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateBarrel',
      args: [d]
    });
  }

  rotateTo(d) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateTo',
      args: [d]
    });
  }

  rotateBarrelTo(d) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateBarrelTo',
      args: [d]
    });
  }

  scan() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'scan',
      args: []
    });
  }

  setColor(color) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'setColor',
      args: [color]
    })
  }

  stop() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'stop',
      args: [],
    });
  }

  stopRotation() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'stopRotation',
      args: [],
    });
  }

  stopBarrelRotation() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'stopBarrelRotation',
      args: [],
    });
  }
}
