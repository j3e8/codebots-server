const Arena = {
  getDimensions: (cb) => {
    prepareAndPostMessage({
      obj: 'Arena',
      fn: 'getDimensions',
      args: []
    }, cb);
  }
}
