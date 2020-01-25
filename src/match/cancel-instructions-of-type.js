module.exports = function cancelInstructionsOfType(bot, type) {
  // if there are any other instructions in the queue for this bot of this type, cancel them
  this.instructionQueue.forEach((instr, i) => {
    if (instr.bot == bot && instr.type == type) {
      this.instructionQueue.splice(i, 1);
    }
  });
}
