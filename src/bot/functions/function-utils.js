const standardizeAngle = function(radianAngle) {
    // standardize angle to between 0 and Math.PI*2
    while (radianAngle > Math.PI*2) {
      radianAngle -= Math.PI*2;
    }
    while (radianAngle < 0) {
      radianAngle += Math.PI*2;
    }

    return radianAngle;
}

module.exports = {
  standardizeAngle
}