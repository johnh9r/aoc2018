'use strict';

const fs = require('fs')

function mostIsolatedPlanet(filename) {
  const buf = fs.readFileSync(filename)
  const data = buf.toString('utf-8').split('\n')

  // accommodate trailing newline (if any)
  if (data[data.length - 1] === '') { data.pop() }

  // single glyph, visually distinct for possible visualisation
  // const planetIds = '0123456789abcdefghkopqrstuvwxyABCDEFGHKLPQRSTUVWXYZ'.split('')

  const planetCoords = data.map(coordsPair => {
    const m = coordsPair.match(/^(\d+),\s(\d+)$/)
    return {
      x: parseInt(m[1], 10),
      y: parseInt(m[2], 10)
    }
  })

  const xsAsc = planetCoords.map(({x, y}) => x).sort((a, b) => a - b)
  const minX = xsAsc[0]
  const [maxX] = xsAsc.slice(-1)

  const ysAsc = planetCoords.map(({x, y}) => y).sort((a, b) => a - b)
  const minY = ysAsc[0]
  const [maxY] = ysAsc.slice(-1)

  // planet positions delineate "edges" of relevant (but notionally infinite) map
  const shortestDists = new Map()

  for (let y = minY; y <= maxY; ++y) {
    for (let x = minX; x <= maxX; ++x) {

      let planetId = 0
      const {id, d} =
        planetCoords.reduce(
          (acc, coords) => {
            let {x: xPlanet, y: yPlanet} = coords
            let {id: closestPlanetId, d: closestPlanetDist} = acc
            const planetDist = Math.abs(xPlanet - x) + Math.abs(yPlanet - y)

            if (planetDist < closestPlanetDist) {
              [closestPlanetId, closestPlanetDist] = [planetId, planetDist]
            } else if (planetDist === closestPlanetDist) {
              // unchanged closestPlanetDist, but tied result w/o single winner (null)
              [closestPlanetId, closestPlanetDist] = [null, closestPlanetDist]
            } // else closest unchanged

            ++planetId
            return {id: closestPlanetId, d: closestPlanetDist}
          },
          {id: null, d: 1_000_000}
        )

      shortestDists.set(xyKey(x, y), {id, d})
    }
  }

  const claimCounts = new Map()
  shortestDists.forEach((v, k) => {
    const {id, d} = v
    if (id !== null) {
      claimCounts.set(id, 1 + (claimCounts.get(id) || 0))
    }
  })

  const claimCountsSortedDesc = [...claimCounts].sort(([_kv, v], [_kw, w]) => w - v)

  const infiniteNorth = horizontalEdge(shortestDists, minY, minX, maxX)
  const infiniteSouth = horizontalEdge(shortestDists, maxY, minX, maxX)
  const infiniteWest = verticalEdge(shortestDists, minX, minY, maxY)
  const infiniteEast = verticalEdge(shortestDists, maxX, minY, maxY)

  const disqualified = new Set([...infiniteNorth, ...infiniteSouth, ...infiniteWest, ...infiniteEast])

  while (true) {
    const [planetId, claimCount] = claimCountsSortedDesc.shift()
    if (disqualified.has(planetId)) {
      continue
    } else {
      return claimCount
    }
  }
}

function horizontalEdge(shortestDists, y, minX, maxX) {
  const edgePlanetIds = new Set()
  for (let x = minX; x <= maxX; ++x) {
    const {id, _} = shortestDists.get(xyKey(x, y))
    id && edgePlanetIds.add(id)
  }
  return edgePlanetIds
}

function verticalEdge(shortestDists, x, minY, maxY) {
  const edgePlanetIds = new Set()
  for (let y = minY; y <= maxY; ++y) {
    const {id, _} = shortestDists.get(xyKey(x, y))
    id && edgePlanetIds.add(id)
  }
  return edgePlanetIds
}

function xyKey(x, y) { return 1_000 * y + x }

module.exports = mostIsolatedPlanet
