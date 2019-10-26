const Histogram = require('./index.js')

const hist = Histogram(20, true)

hist(1)
hist(1)
hist(1)
hist(0.2)
hist(4.6)
hist(4.8)
hist(1)
hist(5)
hist(2)
hist(1.99)
hist(70)
hist(75)
hist(-4)

console.log(hist.value)
