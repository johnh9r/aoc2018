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

function calcMinuteMaxProbAsleep(filename) {
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

  const {worstGuard, worstTotalSleep, worstSingleMinute} =
    [...guardRecords].reduce((acc, guardEntry) => {
        const {worstGuard, worstTotalSleep} = acc
        const [guard, guardMinutes] = guardEntry
        const {guardSleepTotal, worstSingleMinute, _} =
          [...guardMinutes].reduce(
            (acc, [t, count]) => {
              let {guardSleepTotal, worstSingleMinute, worstSingleMinuteValue} = acc
              if (worstSingleMinuteValue < count) {
                acc.worstSingleMinute = t
                acc.worstSingleMinuteValue = count
              }
              acc.guardSleepTotal += count
              return acc
            },
            {guardSleepTotal: 0, worstSingleMinute: NaN, worstSingleMinuteValue: -1}
          )

        if (worstTotalSleep < guardSleepTotal) {
          return {worstGuard: guard, worstTotalSleep: guardSleepTotal, worstSingleMinute: worstSingleMinute}
        }
        return acc
      },
      {worstGuard: null, worstTotalSleep: -1, worstSingleMinute: NaN}
    )

  // console.log(`guard #${worstGuard} slept for ${worstTotalSleep}min and most at minute ${worstSingleMinute}`)
  return parseInt(worstGuard, 10) * worstSingleMinute
}

module.exports = calcMinuteMaxProbAsleep
