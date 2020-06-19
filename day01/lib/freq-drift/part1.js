const fs = require('fs')

function calcTotalFrequencyDrift(filename) {
  // keep it simple for definite given input
  const buf = fs.readFileSync(filename)

  // explicit init of acc to number resolves operator polymorphism of addition
  let sum = buf.toString('utf-8').split('\n').reduce(
    (acc, val) => acc += parseInt(val, 10),
    0
  )

  return sum
}

module.exports = calcTotalFrequencyDrift
