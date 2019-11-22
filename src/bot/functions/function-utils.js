// Standardize angle to between 0 and Math.PI*2
const standardizeAngle = function(radianAngle) {
    while (radianAngle > Math.PI*2) {
      radianAngle -= Math.PI*2;
    }
    while (radianAngle < 0) {
      radianAngle += Math.PI*2;
    }

    return radianAngle;
}

// Convert to radian, making negative angles positive
const degreeToRadian = function(degreeAngle){
  return ( (degreeAngle + 360) % 360) / 180 * Math.PI;
}

module.exports = {
  degreeToRadian,
  standardizeAngle
}