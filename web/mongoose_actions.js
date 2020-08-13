const _CompanyProfile = require('./mongoose_models/CompanyProfile')
const _FinancialsReported = require('./mongoose_models/FinancialsReported')
const _Candle = require('./mongoose_models/Candle')
const _Technicals = require('./mongoose_models/Technicals')

const callback = (err, obj) => {
    if (err) return null
    if (obj) return obj
}

const getCompanyProfile = (ticker) => {
    return _CompanyProfile
        .where({ ticker })
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

const getTechnicals = (symbol, startDate, endDate) => {
    return  _Technicals.find({
            $and: [
                { symbol },
                { t: { $gte: startDate, $lte: endDate } }
            ]
        }, callback)
}

module.exports = { getCompanyProfile, getRandomCompanyProfile, getCandles, getFinancialsReported, getTechnicals }