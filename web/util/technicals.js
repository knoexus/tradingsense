const technicals = ['ATR', 'AD', 'OBV', 'MACD', 'SLOWD', 'SLOWK', 'WILLR', 'ADX', 'APO', 'CCI', 'AROONOSC', 'SAR']

const shuffle = (a) => {
    let array = [...a]
    let counter = array.length
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter)
        counter--
        let temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
    }
    return array
}

const getSplitTechnicals = (takeInPercent, lockedFromTakeInPercent) => {
    if (lockedFromTakeInPercent > 100 || takeInPercent > 100) return null
    const num_taken_items = Math.floor(technicals.length * takeInPercent/100)
    const num_locked_items = Math.floor(num_taken_items * lockedFromTakeInPercent/100)
    const taken_arr = shuffle(technicals).slice(0, num_taken_items)
    return {
        locked: taken_arr.slice(0, num_locked_items),
        unlocked: taken_arr.slice(num_locked_items, taken_arr.length)
    }
}

module.exports = { getSplitTechnicals }