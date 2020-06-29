'use strict';

const fs = require('fs')

// mutating remainingNodes in place
function popMostEligibleNode(depGraph, remainingNodes) {
  // clone for destructive computation
  const eligibleNodes = new Set(remainingNodes)
  // any node with incoming edge is _not_ yet eligible
  for (const n of [...depGraph.values()].flat()) {
    eligibleNodes.delete(n)
  }

  const [mostEligible, ..._tail] = [...eligibleNodes].sort()
  remainingNodes.delete(mostEligible)

  return mostEligible
}

// mutating depGraph in place
function popNextNode(depGraph, remainingNodes) {
  const node = popMostEligibleNode(depGraph, remainingNodes)
  // completing one step potentiallhy unlocks one or more others
  depGraph.delete(node)
  return node
}

function resolveDependencies(filename) {
  const buf = fs.readFileSync(filename)
  const data = buf.toString('utf-8').split('\n')

  // accommodate trailing newline (if any)
  // without duplicating (potentially large) input (cf str.trim())
  if (data[data.length - 1] === '') { data.pop() }

  // build data structure
  // expecting sparse graph, so deciding against incidence matrix
  const remainingNodes = new Set
  const depGraph =
    data.reduce((acc, line) => {
        const m = line.match(/^Step (?<pred>.) must be finished before step (?<succ>.) can begin\.$/)

        const [pred, succ] = [m.groups.pred, m.groups.succ]
        remainingNodes.add(pred)
        remainingNodes.add(succ)

        const allSucc = acc.get(pred) || []
        allSucc.push(succ)
        acc.set(pred, allSucc.sort())

        return acc
      },
      new Map()
    )
  // console.log([...remainingNodes].sort().join(''))
  // console.log([...depGraph])

  // process (consume) data structure
  const seq = []
  let node = null

  while (depGraph.size > 0) {
    node = popNextNode(depGraph, remainingNodes)
    seq.push(node)
  }

  // final node only appeared as successor to others,
  // so no longer identifiable once graph pruned to nothing
  [node] = [...remainingNodes]
  seq.push(node)

  return seq.join('')
}

module.exports = resolveDependencies
