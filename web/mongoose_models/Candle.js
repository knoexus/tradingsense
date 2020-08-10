const mongoose = require('mongoose')
const Schema = mongoose.Schema

const candle_schema = new Schema({
    symbol: { type: String, required: true },
    timestamp: { type: Date, required: true },
    close: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    volume: { type: Number, required: true },
})

module.exports =  mongoose.model('Candle', candle_schema, 'candles')