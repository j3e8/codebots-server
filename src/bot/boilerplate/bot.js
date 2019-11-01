class Bot {

  static get GREEN() { return 'green'; }
  static get BLUE() { return 'blue'; }
  static get GRAY() { return 'gray'; }
  static get TAN() { return 'tan'; }
  static get RED() { return 'red'; }

  constructor() { }

  broadcast(msg) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'broadcast',
      args: [msg]
    });
  }

  fire(cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'fire',
      args: []
    }, cb);
  }

  forward(d, cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'forward',
      args: [d]
    }, cb);
  }

  getBarrelRotation(cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getBarrelRotation',
      args: []
    }, cb);
  }

  getRotation(cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'getRotation',
      args: []
    }, cb);
  }

  reload(cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reload',
      args: []
    }, cb);
  }

  reverse(d, cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'reverse',
      args: [d]
    }, cb);
  }

  rotate(d, cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotate',
      args: [d]
    }, cb);
  }

  rotateBarrel(d, cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateBarrel',
      args: [d]
    }, cb);
  }

  rotateTo(d, cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateTo',
      args: [d]
    }, cb);
  }

  rotateBarrelTo(d, cb) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'rotateBarrelTo',
      args: [d]
    }, cb);
  }

  scan() {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'scan',
      args: []
    }, cb);
  }

  setColor(color) {
    return prepareAndPostMessage({
      obj: 'Bot',
      fn: 'setColor',
      args: [color]
    })
  }
}
