'use strict';

const {calcDisputedFabricSqIn, stakeClaim} = require('../lib/fabric-slices/part1.js')
const findUndisputedFabricClaim = require('../lib/fabric-slices/part2.js')

const expect = require('chai').expect

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
function isSuperset(set, subset) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}

describe('part1', () => {
  it('stakes claim to fabric', () => {
    // from worked example in instructions
    const expClaimSet = new Set()
    expClaimSet.add(20000+3).add(20000+4).add(20000+5).add(20000+6).add(20000+7)
    expClaimSet.add(30000+3).add(30000+4).add(30000+5).add(30000+6).add(30000+7)
    expClaimSet.add(40000+3).add(40000+4).add(40000+5).add(40000+6).add(40000+7)
    expClaimSet.add(50000+3).add(50000+4).add(50000+5).add(50000+6).add(50000+7)

    const actClaimSet = stakeClaim(3,2, 5,4)

    // mutual supersets must be equal
    expect(isSuperset(actClaimSet, expClaimSet) && isSuperset(expClaimSet, actClaimSet)).to.be.true
  })

  it('calculates square inches of fabric covered by multiple claims', () => {
    expect(calcDisputedFabricSqIn('./test/input-part1.txt')).to.equal(117_505)
  })
})

describe('part2', () => {
  it('finds sole undisputed fabric claim', () => {
    expect(findUndisputedFabricClaim('./test/input-part1.txt')).to.equal(1254)
  })
})
