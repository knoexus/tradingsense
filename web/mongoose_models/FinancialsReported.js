const mongoose = require('mongoose')
const Schema = mongoose.Schema

const report_item_schema = new Schema({
    unit: { type: String },
    label: { type: String },
    value: { type: Number },
    concept: { type: String }
}) 

mongoose.model('ReportItem', report_item_schema)

const report_schema = new Schema({
    bs: { type: [report_item_schema] },
    cf: { type: [report_item_schema] },
    ic: { type: [report_item_schema] }
})

mongoose.model('Report', report_schema)

const financials_reported_schema = new Schema({
    accessNumber: { type: String, required: true },
    symbol: { type: String, required: true },
    cik: { type: String, required: true },
    year: { type: Number, required: true },
    quarter: { type: Number, required: true },
    form: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    filedDate: { type: String, required: true },
    acceptedDate: { type: String, required: true },
    report: { type: report_schema }
})

module.exports = mongoose.model('FinancialsReported', financials_reported_schema, 'financials_reported')