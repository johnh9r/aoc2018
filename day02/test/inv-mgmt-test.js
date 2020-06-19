'use strict';

const calcBoxIdChecksum = require('../lib/inv-mgmt/part1.js')
const findCommonBoxIdPart = require('../lib/inv-mgmt/part2.js')

const expect = require('chai').expect

describe('part1', () => {
  it('calculates ID checksum of boxes', () => {
    expect(calcBoxIdChecksum('./test/input-part1.txt')).to.equal(7936)
  })
})

// <Buffer 6c 6e 66 71 64 73 63 77 6a 79 74 65 6f 72 61 6d 62 7a 75 63 68 69 72 67 70 78>
// <Buffer 6c 6e 66 71 64 73 63 77 6a 79 74 65 6f 72 61 6d 62 7a 75 63 68 7a 72 67 70 78>
//                                                                        ^^
describe('part2', () => {
  it('finds ID part common between two relevant boxes', () => {
    expect(findCommonBoxIdPart('./test/input-part1.txt')).to.equal('lnfqdscwjyteorambzuchrgpx')
  })
})
