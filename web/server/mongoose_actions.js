const _CompanyProfile = require('./mongoose_models/CompanyProfile')
const _FinancialsReported = require('./mongoose_models/FinancialsReported')
const _Candle = require('./mongoose_models/Candle')
const _Technicals = require('./mongoose_models/Technicals')
const { getMixedTechnicals } = require('./util/technicals') 
const { getCompanyProfileSimple, getCompanyProfileRandomlyPriced } = require('./util/company_profile')
const { addDays } = require('./util/dates')

const callback = (err, obj) => {
    if (err) return null
    if (obj) return obj
}

const getCompanyProfile = async ticker => {
    const data = await _CompanyProfile
        .where({ ticker })
        .findOne(callback)
    return getCompanyProfileSimple(data._doc)
    
}

const getCompanyProfileByID = async _id => {
    const data = await _CompanyProfile
        .where({ _id })
        .findOne(callback)
    return getCompanyProfileSimple(data._doc)
}

const getRandomCompanyProfile = async () => {
    const company_profile_random = await _CompanyProfile
        .aggregate()
        .sample(1)
    const instance = company_profile_random[0]
    return getCompanyProfileRandomlyPriced(instance)
}

const getCandles = (symbol, startDate, endDate) => {
    return _Candle.find({
            $and: [
                { symbol },
                { timestamp: { $gte: startDate, $lte: endDate } }
            ]
        }, callback)
}

const getFinancialsReported = (symbol, year, quarter) => {
    return _FinancialsReported.where({ 
            symbol,
            year,
            quarter
        })
        .findOne(callback)
}

const getTechnicals = (symbol, startDate, endDate, returnItems, lockItems) => {
    return  _Technicals.find({
            $and: [
                { symbol },
                { t: { $gte: startDate, $lte: endDate } }
            ]
        }, callback)
        .then(data => data.map(e => ({
            symbol,
            t: e.t,
            indicators: getMixedTechnicals(returnItems, lockItems, e.indicators)
        })))
}

const getTechnicalsSingle = (symbol, date) => {
    const plusDate = addDays(date, 1)
    return _Technicals.where({
            symbol,
            t:  { $gte: date, $lte: plusDate } 
        }).findOne(callback)
}

const getTechnicalsSingleMixed = (symbol, startDate, returnItems, lockItems) => {
    const plusDate = addDays(startDate, 1)
    return  _Technicals.where({
            symbol,
            t: { $gte: startDate, $lte: plusDate }
    }).findOne(callback)
    .then(data => ({
        symbol,
        t: data.t,
        indicators: getMixedTechnicals(returnItems, lockItems, data.indicators)
    }))
}

const getTechnicalsSingleFromRange = (symbol, startDate, plus_days) => {
    return _Technicals.find({ 
        symbol,
        t:  { $gte: startDate } 
    }).limit(plus_days).skip(plus_days).findOne(callback)
}

const getCandlesSingle = (symbol, date) => {
    const plusDate = addDays(date, 1)
    return _Candle.where({
            symbol,
            timestamp:  { $gte: date, $lte: plusDate } 
        }).findOne(callback)
}

module.exports = { getCompanyProfile, getCompanyProfileByID, getRandomCompanyProfile, getCandles, 
    getFinancialsReported, getTechnicals, getTechnicalsSingle, getTechnicalsSingleFromRange,
    getTechnicalsSingleMixed, getCandlesSingle }