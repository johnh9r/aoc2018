const fs = require('fs')

// NOTE assuming corresponding length
function compareBuffers(one, other) {
  const diffs = []

  for (let i = 0; i < one.length; ++i) {
    diffs.push(one[i] ^ other[i])
  }

  if (diffs.filter(x => x !== 0).length === 1) {
    return diffs.findIndex(x => x !== 0)
  }

  return null;
}

function findCommonBoxIdPart(filename) {
  const buf = fs.readFileSync(filename)

  // inefficient memory handling and quadratic run-time, but concise algorithm
  const boxIds = buf.toString('utf-8').split('\n')
  const data = boxIds.map(boxId => Buffer.from(boxId, 'utf-8'))

  // xor is commutative, so only compare one side of diagonal
  try {
    // NOTE side-effect
    while (oneBoxId = data.shift()) {
      for (otherBoxId of data) {
        idx = compareBuffers(oneBoxId, otherBoxId)
        if (idx) {
          throw {
            oneBoxId: oneBoxId.toString('utf-8'),
            otherBoxId: otherBoxId.toString('utf-8'),
            index: idx
          }
        }
      }
    }
  } catch ({oneBoxId, otherBoxId, index}) {
    // arbitrarily, delete single mismatching character from first string
    const common = oneBoxId.split('')
    common.splice(index, 1)
    return common.join('')
  }

  return 'NOT_FOUND'
}

module.exports = findCommonBoxIdPart
