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
  k => -1 * k,

  // Similarity function
  (a, b) => a == b ? 2 : -1
)

search$.subscribe(console.log)

// ---- [ { j: 0, i: 3 ... } ]
// ------------------[ { j: 1, i: 4 ... }, { j: 0, i: 3 ... } ]


```
