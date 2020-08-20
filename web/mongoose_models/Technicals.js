const mongoose = require('mongoose')
const Schema = mongoose.Schema

const indicators_schema = new Schema({
    MACD: { type: Number, required: true },
    SLOWD: { type: Number, required: true },
    SLOWK: { type: Number, required: true },
    WILLR: { type: Number, required: true },
    ADX: { type: Number, required: true },
    APO: { type: Number, required: true },
    CCI: { type: Number, required: true },
    AROONOSC: { type: Number, required: true },
    UPPERBAND: { type: Number, required: true },
    MIDDLEBAND: { type: Number, required: true },
    LOWERBAND: { type: Number, required: true },
    AD: { type: Number, required: true },
    ATR: { type: Number, required: true },
    OBV: { type: Number, required: true },
    SAR: { type: Number, required: true }
})

mongoose.model('Indicators', indicators_schema)

const technicals_schema = new Schema({
    symbol: { type: String, required: true },
    t: { type: Date, required: true },
    indicators: { type: indicators_schema }
})

module.exports =  mongoose.model('Technicals', technicals_schema, 'technicals')