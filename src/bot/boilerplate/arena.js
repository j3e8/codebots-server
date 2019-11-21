const Arena = {
  getDimensions: (cb, err) => {
    prepareAndPostMessage({
      obj: 'Arena',
      fn: 'getDimensions',
      args: []
    }, cb, err);
  }
}
