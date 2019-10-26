const DEBUG = false

function log () {
  if (DEBUG) {
    console.log.apply(undefined, arguments)
  }
}

function Histogram (maxBins, toTrim) {
  let n = 0 // Total number of samples
  let hist = new Array(maxBins).fill(0) // Histogram
  let binSize = 0
  let bins = []
  let max
  let min

  // Add new point x to histogram
  function add (x) {
    let i = Math.floor((x - min) * maxBins / (max - min))
    log(`Add ${x} to pos: ${i}`)
    log('Bin value: ', bins[i])
    if ((i > 0) && (x === bins[i])) {
      i -= 1
    }
    hist[i] += 1
    log('Updated hist: ', hist)
  }

  // Split array arr into chunks of chunkSize
  function chunk (arr, chunkSize) {
    let results = []
    while (arr.length) {
      results.push(arr.splice(0, chunkSize))
    }
    return results
  }

  // Shift histogram transforming min, max and bins
  function shiftLeft () {
    log('Shifting histogram left. Before:', hist)
    let steps = 0
    while (!hist[hist.length - 1]) {
      hist.pop()
      hist.unshift(0)
      steps += 1
    }
    if (steps) {
      let coef = steps * (max - min) / hist.length
      max -= coef
      min -= coef
      bins = bins.map(bin => bin - coef)
    }
    log('After:', hist)
  }

  // Shift histogram transforming min, max and bins
  function shiftRight () {
    log('Shifting histogram right. Before:', hist)
    let steps = 0
    while (!hist[0]) {
      hist.shift()
      hist.push(0)
      steps += 1
    }
    if (steps) {
      let coef = steps * (max - min) / hist.length
      max += coef
      min += coef
      bins = bins.map(bin => bin + coef)
    }
    log('After:', hist)
  }

  // Scale histogram with merging bins
  function scale (factor) {
    log(`Scale: ${factor}`)
    const absFactor = Math.abs(factor)
    const padding = new Array(absFactor * hist.length).fill(0)

    let longHist
    if (factor < 0) {
      longHist = padding.concat(hist)
      min -= Math.abs(max - min) * absFactor
    } else {
      longHist = hist.concat(padding)
      max += Math.abs(max - min) * absFactor
    }

    hist = chunk(longHist, absFactor + 1).map(arr => arr.reduce((a, b) => a + b, 0))

    log(`New max: ${max}, min: ${min}`)
    binSize = (max - min) / maxBins
    log('Bin-size: ', binSize)
    bins = []
    for (let k = 0; k <= hist.length; k++) {
      bins.push(min + k * binSize)
    }
    log('Bins: ', bins)
  }

  const histogram = function histogram (x) {
    log('--')
    log(`Value: ${x}, current min: ${min}, max: ${max}`)

    // Check if number
    if (!isNaN(x)) {
      if (typeof x !== 'number') {
        x = parseFloat(x)
      }

      if (n === 0) {
        // First case
        hist[0] = 1
        min = x
        max = x
      } else if (min === max) {
        // Second case or more (if there were repeating values)
        if (x === min) {
          // Repeating value. We still don't know both min and max
          hist[0] += 1
        } else if (x > min) {
          // New value is bigger than first one. Now we know max
          hist[hist.length - 1] = 1
          max = x
        } else {
          // New value is less than first one. We got min
          // Need to move counter to the histogram tail
          hist[hist.length - 1] = hist[0]
          hist[0] = 1
          min = x
        }
      } else {
        // Adding new element with known min/max
        if (x > max) {
          const scaleFactorMax = Math.ceil((x - max) / (max - min))
          if (scaleFactorMax === 1) {
            // We can try shifting histogram and then check if x > max one more time
            // For example: [0, 0, 1, 1, 1] -> [1, 1, 1, 0, 0]
            shiftRight()
            if (x > max) {
              // Still need scaling
              scale(scaleFactorMax, x)
            }
          } else {
            // Scale histogram
            scale(scaleFactorMax, x)
          }
        } else if (x < min) {
          // Same algorithm as for x > max
          const scaleFactorMin = Math.floor((x - min) / (max - min))
          if (scaleFactorMin === -1) {
            shiftLeft()
            if (x < min) {
              scale(scaleFactorMin, x)
            }
          } else {
            scale(scaleFactorMin, x)
          }
        } // *end of extremum cases

        // Now we can add a point to the histogram
        add(x)
      }

      log(hist)
      n += 1
    } else if (Array.isArray(x)) {
      // Array passed as argument, apply histogram to each element
      x.forEach(el => histogram(el))
    }
    return hist
  }

  histogram.fit = function (x) {
    histogram(x)
  }

  Object.defineProperty(histogram, 'value', {
    get: function () {
      let h = hist.slice(0)

      if (toTrim) {
        // Remove right zeros
        while (h[h.length - 1] === 0) {
          h.pop()
        }

        // Remove left zeros
        while (h[0] === 0) {
          h.shift()
        }
      }

      return h
    }
  })

  Object.defineProperty(histogram, 'n', {
    get: function () {
      return n
    }
  })

  Object.defineProperty(histogram, 'max', {
    get: function () {
      return max
    }
  })

  Object.defineProperty(histogram, 'min', {
    get: function () {
      return min
    }
  })

  Object.defineProperty(histogram, 'binSize', {
    get: function () {
      return binSize
    }
  })

  Object.defineProperty(histogram, 'bins', {
    get: function () {
      return bins
    }
  })

  return histogram
}

module.exports = Histogram
