const usernames = [
  'Cleetus',
  'Dorcus',
  'Goober',
  'Gomer',
  'Doof',
  'Capt. Schlubby',
  'Mr. Bean',
  'Dummy Dum Dums',
  'Chris',
  'Leroy'
];

module.exports = function() {
  let i = Math.floor(Math.random() * usernames.length);
  return usernames[i];
}
