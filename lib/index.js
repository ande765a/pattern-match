"use strict"
const Observable = require("rx").Observable


function mmatch(prevres, a, b, simFunc) {
  return prevres + simFunc(a, b)
}

function insdel(rcs, gapPenFunc) {

  let maxi
  let max = -1
  let rcslen = rcs.length - 1

  for(let i = rcslen; i >= 0; i--) {
    if(max < rcs[i].score) {
      max = rcs[i].score
      maxi = i
    }
  }

  return max + gapPenFunc(rcslen - maxi) || 0

}


function patternMatch(subsequence$, sequence, gapPenFunc, simFunc) {

  if(!subsequence$)
    throw new Error("Subsequence not specified")

  if(!sequence)
    throw new Error("Sequence not specified")

  if(!gapPenFunc || typeof gapPenFunc !== "function")
    throw new Error("Not valid gap penalty function")

  if(!simFunc || typeof simFunc !== "function")
    throw new Error("Not valid similarity function")

  const H$ = subsequence$
    .scan((acc, a) => {

      let row = []

      for(let i in sequence) {
        const b = sequence[i]
        const prevres = acc.length && i - 1 >= 0 ?
          acc.rows[acc.length - 1][i - 1].score : 0


        const mmscore = mmatch(prevres, a, b, simFunc)
        const inscore = insdel(row, gapPenFunc)
        const delscore = insdel(acc.rows.map(row => row[i]), gapPenFunc)

        const score = Math.max(0, mmscore, inscore, delscore)
        const direction = score < 0 ? "none" : ["diag", "up", "left"][
          [mmscore, delscore, inscore].indexOf(score)]

        row[i] = {
          score,
          direction
        }
      }

      acc.length++
      acc.rows.push(row)
      return acc

    }, { rows: [], length: 0 })
    .map(acc => acc.rows)

  const position$ = H$.map(H => {

    let max = -1
    let len1 = H.length
    let len2 = H[0].length
    let walk = []
    let maxi, maxj

    for (let i = 0; i < len1; i++) {
      for (let j = 0; j < len2; j++) {
        if (max < H[i][j].score) {
          max = H[i][j].score
          maxi = i
          maxj = j
        }
      }
    }

    for (let i = maxi, j = maxj; len1 > i && len2 > j && i >= 0 && j >= 0;) {

      walk.push({ i, j })

      switch(H[i][j].direction) {
        case "diag":
          i--
          j--
          break
        case "left":
          j--
          break
        case "up":
          i--
          break
        default:
          break
      }
    }

    return walk

  })

  return position$

}


module.exports = patternMatch
