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
        .then(res => ({
            company_profile: res
        }))
}

const getCandles = (symbol, startDate, endDate) => {
    return _Candle.find({
            $and: [
                { symbol },
                { timestamp: { $gte: startDate, $lte: endDate } }
            ]
        }, callback)
        .then(res => ({
            candles: res
        }))
}

const getFinancialsReported = (symbol, year, quarter) => {
    return _FinancialsReported.where({ 
            symbol,
            year,
            quarter
        })
        .findOne(callback)
        .then(res => ({
            financials_reported: res
        }))
}

const getTechnicals = (symbol, startDate, endDate) => {
    return  _Technicals.find({
            $and: [
                { symbol },
                { t: { $gte: startDate, $lte: endDate } }
            ]
        }, callback)
        .then(res => ({
            technicals: res
        }))
}

module.exports = { getCompanyProfile, getCandles, getFinancialsReported, getTechnicals }