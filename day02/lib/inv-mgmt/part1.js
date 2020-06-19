const fs = require('fs')

function calcBoxIdChecksum(filename) {
  const buf = fs.readFileSync(filename)
  const rawData = buf.toString('utf-8').split('\n')

  const data = rawData.map(boxId => {
    const {counts, _} =
      boxId.split('').sort().reduce(
        (acc, ch) => {
          let {counts, curr} = acc

          if (ch === curr) {
            cnt = counts.shift() + 1
          } else {
            cnt = 1
            curr = ch
          }

          counts.unshift(cnt)
          return {counts: counts, curr: curr}
        },
        {counts: [], curr: ''}
      )

    return counts
  })

  const charRepeatedExactlyTwice = data.filter(counts => counts.includes(2))
  const charRepeatedExactlyThreeTimes = data.filter(counts => counts.includes(3))

  return charRepeatedExactlyTwice.length * charRepeatedExactlyThreeTimes.length
}

module.exports = calcBoxIdChecksum
