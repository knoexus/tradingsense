const getRandomIndex = a => Math.floor(Math.random() * a.length)

const daysMarginsAndGaps = [
    [150, 45],
    [120, 35],
    [120, 30],
    [105, 30],
    [90, 30],
    [60, 15],
    [45, 15]
]

const secondsAndStocks = [
    [180, 15],
    [240, 20],
    [300, 30]
]

const initialSum = [
    3000
]

exports.getRandomMarginsAndGaps = () => daysMarginsAndGaps[getRandomIndex(daysMarginsAndGaps)]
exports.getRandomSecondsAndStocks = () => secondsAndStocks[getRandomIndex(secondsAndStocks)]
exports.getInitialSum = () => initialSum[0]