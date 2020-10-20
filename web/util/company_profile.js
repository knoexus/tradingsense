const { shuffle, getRandomNumbers } = require('./baseOps')

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

const companyProfilePricedFromMongoose = mongoose_obj => {
    let obj = {
        logo: {
            value: mongoose_obj.logo,
        },
        finnhubIndustry: {
            value: mongoose_obj.finnhubIndustry,
        },
        nameTickerExchange: {
            value: {
                name: mongoose_obj.name,
                ticker: mongoose_obj.ticker,
                exchange: mongoose_obj.exchange
            }
        }    
    }
    for (let key in obj)
        obj[key].price = null
    return obj
}

const getCompanyProfileSimple = mongoose_obj => {
    const pricedPart = companyProfilePricedFromMongoose(mongoose_obj)
    return {
        ...mongoose_obj,
        ...pricedPart
    }
}

const getCompanyProfileRandomlyPriced = mongoose_obj => {
    const pricedPart = companyProfilePricedFromMongoose(mongoose_obj) 
    const locks = getLocks(pricedPart)
    return {
        ...mongoose_obj,
        ...locks
    }
}

module.exports = { getCompanyProfileSimple, getCompanyProfileRandomlyPriced }