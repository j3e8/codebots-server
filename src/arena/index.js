class Arena {
  constructor(env) {
    this.width = 100;
    this.height = 100;
  }

  getStatus() {
    return {
      width: this.width,
      height: this.height
    }
  }
}

module.exports = Arena;
