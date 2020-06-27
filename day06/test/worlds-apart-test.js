'use strict';

const mostIsolatedPlanet = require('../lib/worlds-apart/part1.js')

const expect = require('chai').expect

describe('part1', () => {
  it('calculates which planet is most remote from all others', () => {
    expect(mostIsolatedPlanet('./test/input-part1.txt')).to.equal(2917)
  })
})
