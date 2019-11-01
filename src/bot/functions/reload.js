module.exports = function(callback) {
  if (this.isLoaded) {
    console.log('already loaded');
    if (callback) {
      callback();
    }
    return;
  }

  setTimeout(() => {
    this.reload();
    console.log('done reloading');
    if (callback) {
      callback();
    }
  }, this.timeBetweenBullets);
}
