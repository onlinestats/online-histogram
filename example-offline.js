const Histogram = require('./index.js')

const hist = Histogram(20, true)

hist([1, 1, 1, 0.2, 4.6, 4.8, 1, 5, 2, 1.99, 70, 75, -4])

console.log(hist.value)
