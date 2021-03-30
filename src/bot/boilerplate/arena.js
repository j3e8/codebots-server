const Arena = {
  getDimensions: () => {
    return prepareAndPostMessage({
      obj: 'Arena',
      fn: 'getDimensions',
      args: []
    });
  }
}
