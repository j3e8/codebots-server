const Match = {
  getBots: (cb, err) => {
    return prepareAndPostMessage({
      obj: 'Match',
      fn: 'getBots',
      args: []
    }, cb, err);
  }
}
