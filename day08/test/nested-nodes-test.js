'use strict';

const parseTreeSumMetadata = require('../lib/nested-nodes/part1.js')

const expect = require('chai').expect

describe('part1', () => {
  it('parses serialised tree and sums metadata', () => {
    expect(parseTreeSumMetadata('./test/input-part1.txt')).to.equal(47_647)
  })
})
