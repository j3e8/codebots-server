const Match = {
  getBots: () => {
    return prepareAndPostMessage({
      obj: 'Match',
      fn: 'getBots',
      args: []
    });
  }
}
