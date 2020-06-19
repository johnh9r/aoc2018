'use strict';

const calcBoxIdChecksum = require('../lib/inv-mgmt/part1.js')

const expect = require('chai').expect

describe('part1', () => {
  it('calculates ID checksum of boxes', () => {
    expect(calcBoxIdChecksum('./test/input-part1.txt')).to.equal(7936)
  })
})
