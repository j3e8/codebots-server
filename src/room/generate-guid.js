let validChars = ['1','2','3','4','5','6','7','8','9'];

module.exports = () => {
  let guid = '';
  while (guid.length < 5) {
    guid = guid + validChars[Math.floor(Math.random()*validChars.length)];
  }
  return guid;
}
