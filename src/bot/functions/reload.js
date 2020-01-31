module.exports = function(callback) {
  this.addSubscriber('reload', callback);

  if (this.isLoaded) {
    this.callSubscribers('reload');
    return;
  }

  if (this.isReloading) {
    return; // wait
  }

  this.isReloading = true;
  setTimeout(() => {
    this.reload();
    this.isReloading = false;
    this.callSubscribers('reload');
  }, this.timeBetweenBullets);
}
