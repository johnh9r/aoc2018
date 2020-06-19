'use strict';

const calcTotalFrequencyDrift = require('../lib/freq-drift/part1.js')
const detectFirstRepeatedFrequency = require('../lib/freq-drift/part2.js')

// https://mochajs.org/#assertions
// const assert = require('assert')
const expect = require('chai').expect

describe('part1', () => {
  it('accumulates frequency changes correctly', () => {
    // assert(total_frequency_drift('./test/input-part1.txt') === 42)
    expect(calcTotalFrequencyDrift('./test/input-part1.txt')).to.equal(536)
  })
})

describe('part2', () => {
  // pending test
  it('detects first repeated frequency', () => {
    expect(detectFirstRepeatedFrequency('./test/input-part1.txt')).to.equal(75108)
  })
})
