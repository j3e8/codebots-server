const Match = {
  getBots: (cb) => {
    prepareAndPostMessage({
      obj: 'Match',
      fn: 'getBots',
      args: []
    }, cb);
  }
}
