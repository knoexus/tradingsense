const { getLocks } = require('./prices&locks/company_profile')

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