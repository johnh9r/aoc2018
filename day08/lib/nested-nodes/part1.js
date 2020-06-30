'use strict';

const fs = require('fs')


function mkReadValue(data) {
  // const _data = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'.split(' ')
  const _data = data

  const fun = function readValue() {
    // serialised data is self-describing: not expecting out-of-bounds access
    const value = _data.shift()
    return parseInt(value, 10)
  }

  return fun
}


function parseNode(readFun) {
  const numChildren = readFun()
  const numMetadata = readFun()

  const childNodes = []
  for (let i = 0; i < numChildren; ++i) {
    childNodes.push(parseNode(readFun))
  }

  const metadata = []
  for (let i = 0; i < numMetadata; ++i) {
    metadata.push(readFun())
  }

  return {
    numMetadata,
    metadata,
    numChildren,
    childNodes
  }
}


function visit(node, fun) {
  fun(node)
  for (const child of node.childNodes) {
    visit(child, fun)
  }

  // signal end of traversal
  return fun(null)
}


function mkCollect() {
  const _coll = []

  const fun = function collectMetadata(node) {
    if (node) {
      _coll.push(node.metadata)
    } else {  // esp. sentinel value: null
      return _coll.flat()
    }
  }

  return fun
}


function parseTreeSumMetadata(filename) {
  const buf = fs.readFileSync(filename)
  const data = buf.toString('utf-8').split(/\s+/)

  // accommodate trailing newline (if any)
  if (data[data.length - 1] === '') { data.pop() }

  const tree = parseNode(mkReadValue(data))

  // visit(tree, ({metadata}) => { console.log(metadata) })
  const allMetadata = visit(tree, mkCollect())

  return allMetadata.reduce((a, x) => a + x, 0)
}


module.exports = parseTreeSumMetadata
