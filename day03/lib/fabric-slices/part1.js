const fs = require('fs')

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
//
// function union(setA, setB) {
//     let _union = new Set(setA)
//     for (let elem of setB) {
//         _union.add(elem)
//     }
//     return _union
// }
//
// function intersection(setA, setB) {
//     let _intersection = new Set()
//     for (let elem of setB) {
//         if (setA.has(elem)) {
//             _intersection.add(elem)
//         }
//     }
//     return _intersection
// }

function stakeClaim(offX, offY, dimX, dimY) {
   const claimSet = new Set()

   for (let y = 0; y < dimY; ++y) {
     for (let x = 0; x < dimX; ++x) {
       // JS does not offer tuples, so encoding (x, y) as unique integer;
       // assuming max X-coord < 10^5
       claimSet.add((10_000 * (offY + y)) + (offX + x))
     }
   }

   return claimSet
}

function calcDisputedFabricSqIn(filename) {
  const buf = fs.readFileSync(filename)
  const data = buf.toString('utf-8').split('\n')

  // accommodate trailing newline (if any)
  if (data[data.length - 1] === '') { data.pop() }

  const claimSets = []

  for (let claim of data) {
    const [_, sOffX, sOffY, sDimX, sDimY] = claim.match(/^#\d+ @ (\d+),(\d+): (\d+)x(\d+)$/)
    const [offX, offY, dimX, dimY] = [sOffX, sOffY, sDimX, sDimY].map(s => parseInt(s, 10))
    claimSets.push(stakeClaim(offX, offY, dimX, dimY))
  }

  let disputedClaims = new Set()
  // set intersection is commutative, so only process below diagonal
  // NOTE side-effect
  while (oneClaim = claimSets.shift()) {
    // XXX clearer, but too slow due to multitude of constructor invocations (temporary objects)
    // disputedClaims = union(disputedClaims, intersection(oneClaim, otherClaim))
    for (let otherClaim of claimSets) {
      for (let oneClaimElem of oneClaim) {
        if (otherClaim.has(oneClaimElem)) { disputedClaims.add(oneClaimElem) }
      }
    }
  }

  return disputedClaims.size
}

exports.stakeClaim = stakeClaim
exports.calcDisputedFabricSqIn = calcDisputedFabricSqIn
