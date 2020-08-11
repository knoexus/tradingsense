const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLSchema, GraphQLBoolean, GraphQLScalarType } = require('graphql')
const _CompanyProfile = require('./mongoose_models/CompanyProfile')
const _FinancialsReported = require('./mongoose_models/FinancialsReported')
const _Candle = require('./mongoose_models/Candle')
const _Technicals = require('./mongoose_models/Technicals')

const CompanyProfile = new GraphQLObjectType({
    name: 'CompanyProfile',
    fields: () => ({
        country: { type: GraphQLString },
        currency: { type: GraphQLString },
        exchange: { type: GraphQLString },
        finnhubIndustry: { type: GraphQLString },
        ipo: { type: GraphQLString },
        logo: { type: GraphQLString },
        marketCapitalization: { type: GraphQLFloat },
        name: { type: GraphQLString },
        phone: { type: GraphQLInt },
        shareOutstanding: { type: GraphQLFloat },
        ticker: { type: GraphQLString },
        weburl: { type: GraphQLString }
    })
})

const ReportItem = new GraphQLObjectType({
    name: 'ReportItem',
    fields: () => ({
        unit: { type: GraphQLString },
        label: { type: GraphQLString },
        value: { type: GraphQLFloat },
        concept: { type: GraphQLString }
    })
})

const Report = new GraphQLObjectType({
    name: 'Report',
    fields: () => ({
        bs: { type: new GraphQLList(ReportItem) },
        cf: { type: new GraphQLList(ReportItem) },
        ic: { type: new GraphQLList(ReportItem) }
    })
})

const FinancialsReported = new GraphQLObjectType({
    name: 'FinancialsReported',
    fields: () => ({
        accessNumber: { type: GraphQLString },
        symbol: { type: GraphQLString },
        cik: { type: GraphQLString },
        year: { type: GraphQLInt },
        quarter: { type: GraphQLInt },
        form: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        filedDate: { type: GraphQLString },
        acceptedDate: { type: GraphQLString },
        report: { type: Report }
    })
})

const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    parseValue(value) {
        return new Date(value)
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10)
        }
        return null
    }
})

const Candle = new GraphQLObjectType({
    name: 'Candle',
    fields: () => ({
        symbol: { type: GraphQLString },
        timestamp: { type: DateTime },
        close: { type: GraphQLFloat },
        high: { type: GraphQLFloat },
        low: { type: GraphQLFloat },
        volume: { type: GraphQLInt }
    })
})

const Technicals = new GraphQLObjectType({
    name: 'Technicals',
    fields: () => ({
        symbol: { type: GraphQLString },
        t: { type: DateTime },
        MACD: { type: GraphQLFloat },
        SLOWD: { type: GraphQLFloat },
        SLOWK: { type: GraphQLFloat },
        WILLR: { type: GraphQLFloat },
        ADX: { type: GraphQLFloat },
        APO: { type: GraphQLFloat },
        CCI: { type: GraphQLFloat },
        AROONOSC: { type: GraphQLFloat },
        UPPERBAND: { type: GraphQLFloat },
        MIDDLEBAND: { type: GraphQLFloat },
        LOWERBAND: { type: GraphQLFloat },
        AD: { type: GraphQLFloat },
        ATR: { type: GraphQLFloat },
        OBV: { type: GraphQLFloat },
        SAR: { type: GraphQLFloat }
    })
})
 
const Mixin = new GraphQLObjectType({
    name: 'Mixin',
    fields: () => ({
        company_profile: { type: CompanyProfile },
        candles: { type: new GraphQLList(Candle) },
        financials_reported: { type: FinancialsReported },
        technicals: { type: new GraphQLList(Technicals) }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        company_profile: {
            type: CompanyProfile,
            args: {
                ticker: { type: GraphQLString }
            },
            resolve(_, args) {
                const query = _CompanyProfile.where({ ...args })
                return query.findOne((err, obj) => {
                    if (err) {
                        return null
                    }
                    if (obj) {
                        return obj
                    }
                })
            }
        },
        financials_reported: {
            type: FinancialsReported,
            args: {
                symbol: { type: GraphQLString },
                year: { type: GraphQLInt },
                quarter: { type: GraphQLInt }
            },
            resolve(_, args) {
                const query = _FinancialsReported.where({ ...args })
                return query.findOne((err, obj) => {
                    if (err) {
                        return null
                    }
                    if (obj) {
                        return obj
                    }
                })
            }
        },
        candles_for_period: {
            type: new GraphQLList(Candle),
            args: {
                symbol: { type: GraphQLString },
                startDate: { type: GraphQLInt },
                endDate: { type: GraphQLInt }
            },
            async resolve(_, args) {
                const candles = await _Candle.find({
                    $and: [
                        { symbol: args.symbol },
                        { timestamp: { $gte: new Date(args.startDate*1000), $lte: new Date(args.endDate*1000) } }
                    ]
                })
                return candles
            }
        },
        mix: {
            type: Mixin,
            args: {
                symbol: { type: GraphQLString },
                startDate: { type: GraphQLInt },
                endDate: { type: GraphQLInt },
                year: { type: GraphQLInt },
                quarter: { type: GraphQLInt }
            },
            async resolve(_, args) {
                const callback = (err, obj) => {
                    if (err) {
                        return null
                    }
                    if (obj) {
                        return obj
                    }
                }
                let promises = []
                //company_profile
                const company_profile = _CompanyProfile.where({ ticker: args.symbol }).findOne(callback).then(res => ({
                    company_profile: res
                }))
                //candles
                const candles =  _Candle.find({
                    $and: [
                        { symbol: args.symbol },
                        { timestamp: { $gte: new Date(args.startDate*1000), $lte: new Date(args.endDate*1000) } }
                    ]
                }).then(res => ({
                    candles: res
                }))
                //financials_reported
                const financials_reported = _FinancialsReported.where({ 
                    symbol: args.symbol,
                    year: args.year,
                    quarter: args.quarter
                }).findOne(callback).then(res => ({
                    financials_reported: res
                }))
                //technicals
                const technicals = _Technicals.find({
                    $and: [
                        { symbol: args.symbol },
                        { t: { $gte: new Date(args.startDate*1000), $lte: new Date(args.endDate*1000) } }
                    ]
                }).then(res => ({
                    technicals: res
                }))
                promises.push(company_profile)
                promises.push(candles)
                promises.push(financials_reported)
                promises.push(technicals)
                return await Promise.all(promises)
                    .then(vals => {
                        return vals.reduce((acc, current) => {
                            const key = Object.keys(current)[0] 
                            acc[key] = current[key]
                            return acc
                        }, {})
                    })
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})