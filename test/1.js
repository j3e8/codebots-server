function MyBot() {
  this.name = 'MyBot';

  this.receiveMessage = (msg) => {
    console.log(`${this.name} received message:`, msg);
  }

  this.onStart = () => {
    this.broadcast(`hello, is it ${this.name} you're looking for?`);
    this.forward(50, () => {
      console.log('arrived.');
    });

    this.rotateTo(90, () => {
      console.log('rotated');
    });
  }
}

module.exports = MyBot;
