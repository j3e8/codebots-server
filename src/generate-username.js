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
  'Leroy',
  'El Presidente',
  'T-bone',
  'TJ',
  'Betty',
  'Tanky',
  'Suzette',
  'Chuck',
  'Kingsley',
  'Stefan',
  'Billy Bob Joe',
];

module.exports = function() {
  let i = Math.floor(Math.random() * usernames.length);
  return usernames[i];
}
