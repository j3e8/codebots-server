const Match = {
  getBots: (cb, err) => {
    prepareAndPostMessage({
      obj: 'Match',
      fn: 'getBots',
      args: []
    }, cb, err);
  }
}
