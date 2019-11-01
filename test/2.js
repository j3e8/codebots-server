function MySecondBot() {
  this.name = 'MySecondBot';

  this.receiveMessage = (msg) => {
    console.log(`${this.name} received message:`, msg);
  }

  this.onStart = () => {
    this.broadcast(`my name is inigo montoya. you killed my father. prepare to die`);
  }
}

module.exports = MySecondBot;
