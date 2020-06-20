const fs = require('fs')

function blankSleepRecord() {
  const allMinutesBlank = []
  for (let t = 0; t < 60; ++t) {
    allMinutesBlank.push([t, 0])
  }
  return new Map(allMinutesBlank)
}

function addToSleepRecord(guardRecords, guard, startSleep, endSleep) {
  if (!guardRecords.has(guard)) { guardRecords.set(guard, blankSleepRecord())}
  const recordByMinute = guardRecords.get(guard)

  // "asleep on the minute they fall asleep, and [...] awake on the minute they wake up"
  for (t = startSleep; t < endSleep; ++t) {
    // all minutes guaranteed to exist from initialisation
    // mutating in place
    recordByMinute.set(t, recordByMinute.get(t) + 1)
  }
}

function calcMostAsleepOnSameMinute(filename) {
  const buf = fs.readFileSync(filename)
  const data = buf.toString('utf-8').split('\n')

  // accommodate trailing newline (if any)
  if (data[data.length - 1] === '') { data.pop() }

  data.sort()

  // guardRecords: map of guards (by #) to sleep records
  // sleepRecords: map of minutes (0..59) to count of instances found asleep
  const guardRecords = new Map()
  // guard number stays as string
  let guard = null
  let startSleep = NaN
  let endSleep = NaN

  let entry = null
  while (entry = data.shift()) {
    let [_, minute] = entry.match(/^\[\d\d\d\d-\d\d-\d\d \d\d:(\d\d)\]/)

    if (entry.endsWith('begins shift')) {
      [_, guard] = entry.match(/Guard #(\d+) begins shift/)
    } else if (entry.endsWith('falls asleep')) {
      startSleep = parseInt(minute, 10)
    } else if (entry.endsWith('wakes up')) {
      endSleep = parseInt(minute, 10)
      addToSleepRecord(guardRecords, guard, startSleep, endSleep)
      // NOTE guard currently on duty may experience further periods of sleep
      startSleep = endSleep = NaN
    } else {
      throw 'unexpected guard log entry'
    }
  }

  const {worstGuard, worstSingleMinute, worstSingleMinuteValue} =
    [...guardRecords].reduce((acc, guardEntry) => {
        const {worstGuard, worstSingleMinute, worstSingleMinuteValue} = acc
        const [guard, guardMinutes] = guardEntry

        const {currWorstSingleMinute, currWorstSingleMinuteValue} =
          [...guardMinutes].reduce(
            (acc, [t, count]) => {
              let {currWorstSingleMinute, currWorstSingleMinuteValue} = acc
              if (currWorstSingleMinuteValue < count) {
                return {currWorstSingleMinute: t, currWorstSingleMinuteValue: count}
              }
              return acc
            },
            {currWorstSingleMinute: NaN, currWorstSingleMinuteValue: -1}
          )

        if (worstSingleMinuteValue < currWorstSingleMinuteValue) {
          return {worstGuard: guard, worstSingleMinute: currWorstSingleMinute, worstSingleMinuteValue: currWorstSingleMinuteValue}
        }
        return acc
      },
      {worstGuard: null, worstSingleMinute: NaN, worstSingleMinuteValue: -1}
    )

  // console.log(`guard #${worstGuard} slept most, viz. ${worstSingleMinuteValue} times on minute ${worstSingleMinute}`)
  return parseInt(worstGuard, 10) * worstSingleMinute
}

module.exports = calcMostAsleepOnSameMinute
