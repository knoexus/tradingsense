const mongoose = require('mongoose')
const Schema = mongoose.Schema

const company_profile_schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true },
  exchange: { type: String, required: true },
  finnhubIndustry: { type: String, required: true },
  ipo: { type: String, required: true },
  logo: { type: String, required: true },
  marketCapitalization: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  shareOutstanding: { type: Number, required: true },
  ticker: { type: String, required: true },
  weburl: { type: String, required: true },
})

module.exports =  mongoose.model('CompanyProfile', company_profile_schema, 'company_profile')