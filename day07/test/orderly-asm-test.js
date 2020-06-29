'use strict';

const resolveDependencies = require('../lib/orderly-asm/part1.js')

const expect = require('chai').expect

describe('part1', () => {
  it('resolves dependency graph into correct sequence of steps', () => {
    expect(resolveDependencies('./test/input-part1.txt')).to.equal('ACBDESULXKYZIMNTFGWJVPOHRQ')
  })
})
