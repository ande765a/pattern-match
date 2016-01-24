# Pattern Match

An optimized reactive smith-waterman pattern matcher.

## Usage:

```js
import patternMatch from "pattern-match"
import { Observable } from "rx"

const search$ = patternMatch(
  // Input stream
  Observable.of(4, 5),

  // Sequence
  [1, 2, 3, 4, 5, 6, 7, 8],

  // Gap Penalty Function
  k => -2 * k,

  // Similarity function
  (a, b) => a == b ? 2 : -1
)

search$.subscribe(console.log)

// ---- [ { i: 0, j: 3 } ]
// ------------------[ { i: 1, j: 4 }, { i: 0, j: 3 } ]


```
