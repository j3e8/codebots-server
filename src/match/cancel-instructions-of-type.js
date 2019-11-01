module.exports = function cancelInstructionsOfType(bot, type) {
  // if there are any other instructions in the queue for this bot of this type, cancel them
  this.instructionQueue.forEach((instr) => {
    if (instr.bot == bot && instr.type == type) {
      this.instructionQueue.splice(this.instructionQueue.indexOf(instr), 1);
    }
  });
}
