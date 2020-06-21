const fs = require('fs')

// space character has no upper-case equivalent, so implicitly ruled out from input data
// and suitable to fill gap of previously erased unit pairs
const voidUnit = 0x20

function adjacentUnits(buffer, i) {
  // """ from Node.js docs:
  // buf[index] is inherited from Uint8Array [...]
  // buf[index] returns undefined when index >= buf.length
  // buf[index] = value does not modify buffer if index >= buf.length
  // """
  let currUnit = null
  let currIdx = i

  while ((currIdx <= buffer.length) && ((currUnit = buffer[currIdx]) === voidUnit)) {
    ++currIdx
  }
  // deliberate special case: out-of-bounds access invents harmless default value
  currUnit = currUnit || voidUnit

  let nextUnit = null
  let nextIdx = currIdx + 1
  while ((nextIdx <= buffer.length) && ((nextUnit = buffer[nextIdx]) === voidUnit)) {
    ++nextIdx
  }
  // deliberate special case: out-of-bounds access invents harmless default value
  nextUnit = nextUnit || voidUnit

  return [[currUnit, currIdx], [nextUnit, nextIdx]]
}

function processPolymerChain(buffer) {
  let revisit = true

  // recursion tempting, but call stack likely deep (and no optimisation for tail recursion)
  while (revisit) {
    revisit = false

    for (let i = 0; i < buffer.length; ++i) {
      const [[currUnit, currIdx], [nextUnit, nextIdx]] = adjacentUnits(buffer, i)

      // assuming 7-bit ASCII (in UTF-8 representation) for all units of polymer;
      // upper- and lower-case letters then exactly differ by 0x20, e.g. 0x41='A' and 0x61='a'
      if ((currUnit ^ nextUnit) === 0x20) {
        // mutually neutralise units
        buffer[currIdx] = buffer[nextIdx] = voidUnit
        i = nextIdx + 1
        revisit = true
      }
    }
  }

  // mutated in place
  return buffer
}

function polymerToString(buffer) {
  return buffer.filter(c => c !== voidUnit).toString('utf-8')
}

function calcMostCollapsiblePolymerChain(filename) {
  const buffer = fs.readFileSync(filename)

  const allUnits = Buffer.from('abcdefghijklmnopqrstuvwxyz')

  const shortestPossibleChain =
    allUnits.reduce(
      (acc, unit) => {
        // lower-case comparison
        const purgedBuffer = buffer.filter(c => ((c | 0x20) !== unit))
        const resultWithGaps = processPolymerChain(purgedBuffer)
        const result = polymerToString(resultWithGaps)
        // console.log(`purged ${unit}: purged ${purgedBuffer.length}, collapsed ${result.length}`)

        if (result.length < acc) {
          return result.length
        }
        return acc
      },
      buffer.length
    )

  return shortestPossibleChain
}

module.exports = calcMostCollapsiblePolymerChain
