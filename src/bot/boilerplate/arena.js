const Arena = {
  getDimensions: (cb, err) => {
    return prepareAndPostMessage({
      obj: 'Arena',
      fn: 'getDimensions',
      args: []
    }, cb, err);
  }
}
