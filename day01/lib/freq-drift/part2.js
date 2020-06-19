const fs = require('fs')

// function* cycle(iter) {
//   while (true) {
//     yield* iter.values()
//   }
// }
//
// for (x of cycle([1,2,3])) { console.log(x) }
//
// but reduce() is defined on (finite-length) Array

function detectFirstRepeatedFrequency(filename) {
  // keep it simple for definite given input
  const buf = fs.readFileSync(filename)

  let acc0 = 0
  const frequencies = new Set()
  frequencies.add(acc0)

  const frequencyDiffs = buf.toString('utf-8').split('\n')
  try {
    while (true) {
      // on wrap-around, continue from latest accumulator (not initial zero)
      acc0 = frequencyDiffs.reduce(
        (acc, val) => {
          newAcc = acc + parseInt(val, 10)

          if (frequencies.has(newAcc)) {
            throw newAcc
          }

          frequencies.add(newAcc)
          return newAcc
        },
        acc0
      )
    }
  } catch(duplicateFrequency) {
    return duplicateFrequency
  }
  return NaN
}

module.exports = detectFirstRepeatedFrequency
