const config = require('config');
const fsp = require('fs-promise');

const class_name_r = /class\s+([a-z_0-9]+)\s+extends\s+Bot/mi;

module.exports = function(scriptPath, srcPath, msgScript) {
  return fsp.writeFile(srcPath, msgScript)
  .then(() => Promise.all([
      fsp.readFile(process.cwd() + '/src/bot/boilerplate/arena.js', 'utf8'),
      fsp.readFile(process.cwd() + '/src/bot/boilerplate/bot.js', 'utf8'),
      fsp.readFile(process.cwd() + '/src/bot/boilerplate/match.js', 'utf8'),
      fsp.readFile(process.cwd() + '/src/bot/boilerplate/messaging.js', 'utf8')
    ])
  )
  .then((results) => {
    let className = determineUsersBotClassName(msgScript);
    if (!className) {
      return Promise.reject("Invalid Bot class name");
    }
    let messaging = results[3].replace('UserBotClassName', className);
    let script = results[0] + "\n" + results[1] + "\n" + results[2] + "\n" + msgScript + "\n" + messaging;
    return fsp.writeFile(scriptPath, script);
  })
}

function determineUsersBotClassName(script) {
  let match = script.match(class_name_r);
  if (!match || match.length < 2) {
    return;
  }
  return match[1];
}
