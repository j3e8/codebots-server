module.exports = function(callback) {
  this.addSubscriber('reload', callback);

  if (this.isLoaded) {
    console.log('already loaded');
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
    console.log('done reloading');
    this.callSubscribers('reload');
  }, this.timeBetweenBullets);
}
