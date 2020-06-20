const fs = require('fs')

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

function findUndisputedFabricClaim(filename) {
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

  const remainingCandidateClaims = new Set()
  for (let i = 0; i < claimSets.length; ++i) { remainingCandidateClaims.add(i)}

  // set intersection is commutative, so only process below diagonal
  for (let j = 0; j < claimSets.length; ++j) {
    oneClaim = claimSets[j]
    for (let k = 0; k < j; ++k) {
      otherClaim = claimSets[k]

      for (let oneClaimElem of oneClaim) {
        if (otherClaim.has(oneClaimElem)) {
          // both sets ruled out by overlap;
          // idempotent book-keeping operations
          remainingCandidateClaims.delete(j)
          remainingCandidateClaims.delete(k)
        }
      }
    }
  }

  [undisputedClaim] = remainingCandidateClaims.values()

  // array index 0 holds claim #1
  return undisputedClaim + 1
}

module.exports = findUndisputedFabricClaim
