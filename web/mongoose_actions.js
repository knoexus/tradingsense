const _CompanyProfile = require('./mongoose_models/CompanyProfile')
const _FinancialsReported = require('./mongoose_models/FinancialsReported')
const _Candle = require('./mongoose_models/Candle')
const _Technicals = require('./mongoose_models/Technicals')
const { getMixedTechnicals } = require('./util/technicals') 

const callback = (err, obj) => {
    if (err) return null
    if (obj) return obj
}

const getCompanyProfile = (ticker) => {
    return _CompanyProfile
        .where({ ticker })
        .findOne(callback)
}

const getCompanyProfileByID = (_id) => {
    return _CompanyProfile
        .where({ _id })
        .findOne(callback)
}

const getRandomCompanyProfile = async () => {
    const company_profile_random = await _CompanyProfile
        .aggregate()
        .sample(1)
    return company_profile_random[0]
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
            ...e,
            indicators: getMixedTechnicals(returnItems, lockItems, e.indicators)
        })))
}

const getTechnicalsSingle = (symbol, date) => {
    let plusDate = new Date()
    plusDate.setDate(date.getDate() + 1)
    return _Technicals.where({
            symbol,
            t:  { $gte: date, $lte: plusDate } 
        }).findOne(callback)
}

module.exports = { getCompanyProfile, getCompanyProfileByID, getRandomCompanyProfile, getCandles, 
    getFinancialsReported, getTechnicals, getTechnicalsSingle }