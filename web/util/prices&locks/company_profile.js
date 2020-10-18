const { shuffle, getRandomNumbers } = require('../baseOps')

const basePrices = {
    logo: 100,
    nameTickerExchange: 200,
    finnhubIndustry: 50
}

const getPrices = mult => {
    let obj = {}
    for (key in basePrices) 
        obj[key] = mult/10 * basePrices[key]
    return obj
}

const getLocks = (obj, mult=10) => {
    let entr = shuffle(Object.entries(obj))
    const prices = getPrices(mult)
    const lockedIndices = getRandomNumbers(0, entr.length, entr.length-1) // pick the latter randomly too
    const locked = lockedIndices.reduce((acc, e)  => {
        const k = entr[e][0]
        return {
            ...acc,
            [k]: {
                value: null,
                price: prices[k]
            }
        }
    }, {})
    return {
        ...obj,
        ...locked
    }
}

module.exports = { getLocks }