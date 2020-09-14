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
    [180, 20],
    [180, 30]
]

exports.getRandomMarginsAndGaps = () => daysMarginsAndGaps[getRandomIndex(daysMarginsAndGaps)]
exports.getRandomSecondsAndStocks = () => secondsAndStocks[getRandomIndex(secondsAndStocks)]