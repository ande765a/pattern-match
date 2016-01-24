"use strict"
const patternSearch = require("./lib/index")
const Observable = require("rx").Observable

patternSearch(
  Observable.of(4, 5),
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  k => -2 * k,
  (a, b) => a == b ? 2 : -1
).subscribe(console.log)
