const mongoose = require('mongoose')
const Schema = mongoose.Schema

const indicators_schema = new Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true }
})

mongoose.model('Indicators', indicators_schema)

const technicals_schema = new Schema({
    symbol: { type: String, required: true },
    t: { type: Date, required: true },
    indicators: { type: [indicators_schema] }
})

module.exports =  mongoose.model('Technicals', technicals_schema, 'technicals')