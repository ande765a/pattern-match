"use strict"
const Observable = require("rx").Observable

// Implementation: https://en.wikipedia.org/wiki/Smith–Waterman_algorithm

function maxList(list) {

  if(!list.length) throw new Error("Cannot find max of empty list")

  let maxidx = 0
  let max   = list[0]
  for(let i in list) {
    if(list[i] > max) {
      max = list[i]
      maxidx = i
    }
  }
  return { index: maxidx, value: max }
}

function maxRange(from, to, mapFn) {
  let maxidx = -1
  let max   = -1
  for(let k = from; k <= to; k++) {
    const res = mapFn(k)
    if(res > max) {
      maxidx = k
      max = res
    }
  }
  return { index: maxidx, value: max }
}

function patternMatch(subsequence$, sequence, gapPenFunc, simFunc) {

  if(!subsequence$)
    throw new Error("Subsequence not specified")

  if(!sequence)
    throw new Error("Sequence not specified")

  if(!gapPenFunc || typeof gapPenFunc !== "function")
    throw new Error("Invalid gap penalty function")

  if(!simFunc || typeof simFunc !== "function")
    throw new Error("Invalid similarity function")

  const HT$ = subsequence$
    .scan((acc, a, j) => {

      let columns = acc.columns
      let max     = acc.max

      let row = []
      const seqLen = sequence.length
      for(let i = 0; i < seqLen; i++) {
        const b = sequence[i]
        const upLeft = j == 0 || i == 0 ? 0 : columns[j - 1][i - 1].score
        const maxRes = maxList([
          0,
          upLeft + simFunc(a, b),
          maxRange(1, i, k => row[i - k].score + gapPenFunc(k)).value,
          maxRange(1, j, k => columns[j - k][i].score + gapPenFunc(k)).value
        ])

        const score     = maxRes.value
        const direction = ["none", "diag", "left", "up"][maxRes.index]
        const type      = ["break", "match", "delete", "gap"][maxRes.index]

        if(score > max.score) {
          max = { i, j, score }
        }

        row[i] = { i, j, score, direction, type }

      }
      columns[j] = row
      return { max, columns }

    }, {max: {i: 0, j: 0, score: 0}, columns: []})
    .map(res => {

      const columns = res.columns
      const maxj = res.max.j
      const maxi = res.max.i
      let walk = []
      for (let i = maxi, j = maxj; i >= 0 && j >= 0;) {

        walk.push(columns[j][i])
        switch(columns[j][i].direction) {
          case "diag":
            i--
            j--
            break
          case "left":
            i--
            break
          case "up":
            j--
            break
          default:
            break
        }

      }

      return walk

    })

  return HT$

}

module.exports = patternMatch
