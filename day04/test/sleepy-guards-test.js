'use strict';

const calcMinuteMaxProbAsleep = require('../lib/sleepy-guards/part1.js')

const expect = require('chai').expect

describe('part1', () => {
  it('calculates minute most often asleep for guard asleep most', () => {
    expect(calcMinuteMaxProbAsleep('./test/input-part1.txt')).to.equal(36_898)  // guard #971 x minute 38
  })
})
