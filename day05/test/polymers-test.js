'use strict';

const {collapsePolymerChain, polymerToString} = require('../lib/polymers/part1.js')

const expect = require('chai').expect

describe('part1', () => {
  it ('squeezes gaps out of processed polymer', () => {
    const buf = Buffer.from([0x20, 0x20, 0x62, 0x75, 0x66, 0x20, 0x20, 0x66, 0x65, 0x72, 0x20, 0x20]);
    expect(polymerToString(buf)).to.equal('buffer')
  })

  it('collapses polymer chain to minimum', () => {
    expect(collapsePolymerChain('./test/input-part1.txt')).to.equal(9_116)
  })
})
