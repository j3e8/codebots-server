class Bot {
  static get GREEN() { return 'green'; }
  static get BLUE() { return 'blue'; }
  static get GRAY() { return 'gray'; }
  static get TAN() { return 'tan'; }
  static get RED() { return 'red'; }

  constructor() {
    // fun little overrides
    console.log = this.log;
    console.warn = this.log;
    console.error = this.log;
    console.trace = () => this.log("console.trace is not allowed in Bot worker class");
  }

  broadcast(msg, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'broadcast',
      args: [msg]
    }, cb, err);
  }

  log(...args) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'log',
      args: [...args]
    });
  }

  fire(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'fire',
      args: []
    }, cb, err);
  }

  forward(d, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'forward',
      args: [d]
    }, cb, err);
  }

  getBarrelRotation(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getBarrelRotation',
      args: []
    }, cb, err);
  }

  getLocation(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getLocation',
      args: []
    }, cb, err);
  }

  getRotation(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getRotation',
      args: []
    }, cb, err);
  }

  getStatus(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getStatus',
      args: []
    }, cb, err);
  }

  reload(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reload',
      args: []
    }, cb, err);
  }

  reverse(d, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reverse',
      args: [d]
    }, cb, err);
  }

  rotate(d, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotate',
      args: [d]
    }, cb, err);
  }

  rotateBarrel(d, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateBarrel',
      args: [d]
    }, cb, err);
  }

  rotateTo(d, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateTo',
      args: [d]
    }, cb, err);
  }

  rotateBarrelTo(d, cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateBarrelTo',
      args: [d]
    }, cb, err);
  }

  scan(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'scan',
      args: []
    }, cb, err);
  }

  setColor(color) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'setColor',
      args: [color]
    })
  }

  stop(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'stop',
      args: [],
    }, cb, err);
  }

  stopRotation(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'stopRotation',
      args: [],
    }, cb, err);
  }

  stopBarrelRotation(cb, err) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'stopBarrelRotation',
      args: [],
    }, cb, err);
  }
}
