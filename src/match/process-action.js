module.exports = function processAction(instr, elapsedMs) {
  // If the bot isn't alive, don't process the instruction and splice it out of the queue
  if (!instr.bot.alive) {
    // remove the instruction from the queue
    this.instructionQueue.splice(this.instructionQueue.indexOf(instr), 1);
    return;
  }

  let result = instr.instruction(elapsedMs);

  // call the animate frame method
  if (result.finished) {
    // If the action is finished, remove the instruction from the queue
    this.instructionQueue.splice(this.instructionQueue.indexOf(instr), 1);

    // call the callback if there is one
    if (instr.callback) {
      instr.callback(result.value);
    }
  }
}
