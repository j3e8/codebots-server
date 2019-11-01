module.exports = function processAction(instr, elapsedMs) {
  let result = instr.instruction(elapsedMs);

  // call the animate frame method
  if (result.finished) {
    // remove the instruction from the queue
    this.instructionQueue.splice(this.instructionQueue.indexOf(instr), 1);

    // call the callback if there is one
    if (instr.callback) {
      instr.callback(result.value);
    }
  }
}
