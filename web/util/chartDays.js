const daysMarginsAndGaps = [
    [150, 45],
    [120, 35],
    [120, 30],
    [90, 30],
    [60, 15],
    [45, 15],
    [45, 10]
]

exports.getRandomMarginsAndGaps = () => daysMarginsAndGaps[Math.floor(Math.random() * daysMarginsAndGaps.length)]