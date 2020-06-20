'use strict';

const calcMinuteMaxProbAsleep = require('../lib/sleepy-guards/part1.js')
const calcMostAsleepOnSameMinute = require('../lib/sleepy-guards/part2.js')

const expect = require('chai').expect

describe('part1', () => {
  it('calculates minute most often asleep for guard asleep most', () => {
    expect(calcMinuteMaxProbAsleep('./test/input-part1.txt')).to.equal(36_898)  // guard #971 x minute 38
  })
})

describe('part2', () => {
  it('calculates guard most often asleep and on which same minute', () => {        // aside: 15 times
    expect(calcMostAsleepOnSameMinute('./test/input-part1.txt')).to.equal(80_711)  // guard #1877 x minute 43
  })
})
