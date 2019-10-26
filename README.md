# online-histogram (no tests yet!)
Online histogram calculation (piece-by-piece)

## Parameters
* `maxBins` - max number of bins. Total number of bins will be in range (maxBins/2, maxBins)
* `toTrim` (default `false`) - if `true` zeros will be removed from both histogram tails

## Usage
```javascript
const Histogram = require('online-histogram')

// Create a new histogram object calling Histogram() or new Histogram()
// Each of those object stores histogram values and other variables like min/max
// We need this extra step to be able to calculate histograms of multiple data flows
const h1 = Histogram(20)
const h2 = new Histogram(20, true) // same as const h2 = Histogram(20, true)

// Update calling histogram objects directly, as a function:
;[1, 2, 3, 4, 5].forEach(v => { h1(v) })

// Or via .fit() method. These two ways are identical!
;[4, 5, 6, 7, 8].forEach(v => { h2.fit(v) })

// Using  with arrays:
h1([9, 10, 11]) // Keep in mind - this line updates existing histogram `h1` with 3 new data values

// Get histogram calling histogram object with no arguments:
console.log('h1:', h1())

// Or via .value getter
console.log('h2:', h2.value)

// Total number of observations:
console.log('h2 n:', h2.n)

// 'n' and 'value' are not just object keys, but object getters.
```
