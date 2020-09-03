const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLID, GraphQLSchema, GraphQLScalarType } = require('graphql')
const { getQuarterAndYear, addDays, dateDiff } = require('./util/dates')
const { getCompanyProfile, getRandomCompanyProfile, getCandles, getFinancialsReported, 
        getTechnicals, getTechnicalsSingle, getCompanyProfileByID, getTechnicalsSingleFromRange } = require('./mongoose_actions')
const { getErrorMessage, errorTypes: { NULLRESPONSE, RECURSIONEXCEEDED, DATAMISMATCH, INSUFFICIENTDATA }  } = require('./util/errors')
const { getRandomMarginsAndGaps } = require('./util/chartDays')

const CompanyProfile = new GraphQLObjectType({
    name: 'CompanyProfile',
    fields: () => ({
        _id: { type: GraphQLID },
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

const Indicator = new GraphQLObjectType({
    name: 'Indicator',
    fields: () => ({
        name: { type: GraphQLString },
        value: { type: GraphQLFloat }
    })
})

const IndicatorWNext = new GraphQLObjectType({
    name: 'IndicatorWNext',
    fields: () => ({
        name: { type: GraphQLString },
        value: { type: GraphQLFloat },
        valueX: { type: GraphQLFloat },
        percentChange: { type: GraphQLFloat }
    })
})
 
const Technicals = new GraphQLObjectType({
    name: 'Technicals',
    fields: () => ({
        symbol: { type: GraphQLString },
        t: { type: DateTime },
        indicators: { type: new GraphQLList(Indicator) }
    })
})
 
const Mixin = new GraphQLObjectType({
    name: 'Mixin',
    fields: () => ({
        startDate: { type: GraphQLInt },
        endDate: { type: GraphQLInt },
        gapToEndpoint: { type: GraphQLInt },
        company_profile: { type: CompanyProfile },
        candles: { type: new GraphQLList(Candle) },
        financials_reported: { type: FinancialsReported },
        technicals_day0: { type: Technicals }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        company_profile: {
            type: CompanyProfile,
            args: {
                ticker: { type: GraphQLString },
                _id: {type: GraphQLID }
            },
            async resolve(_, args) {
                if ('ticker' in args)
                    return await getCompanyProfile(args.ticker)
                else return await getCompanyProfileByID(args._id)
            }
        },
        company_profile_random: {
            type: CompanyProfile,
            async resolve() {
                return await getRandomCompanyProfile()
            }
        },
        financials_reported: {
            type: FinancialsReported,
            args: {
                symbol: { type: GraphQLString },
                year: { type: GraphQLInt },
                quarter: { type: GraphQLInt }
            },
            async resolve(_, args) {
                return await getFinancialsReported(args.symbol, args.year, args.quarter)
            }
        },
        candles: {
            type: new GraphQLList(Candle),
            args: {
                symbol: { type: GraphQLString },
                startDate: { type: GraphQLInt },
                endDate: { type: GraphQLInt }
            },
            async resolve(_, args) {
                const startDate = new Date(args.startDate*1000), endDate = new Date(args.endDate*1000)
                return await getCandles(args.symbol, startDate, endDate)
            }
        },
        technicals: {
            type: new GraphQLList(Technicals),
            args: {
                symbol: { type: GraphQLString },
                startDate: { type: GraphQLInt },
                endDate: { type: GraphQLInt },
                returnItems: { type: GraphQLInt },
                lockItems: { type: GraphQLInt }
            },
            async resolve(_, args) {
                const startDate = new Date(args.startDate*1000), endDate = new Date(args.endDate*1000)
                return await getTechnicals(args.symbol, startDate, endDate, args.returnItems, args.lockItems)
            }
        },
        technicals_single: {
            type: Indicator,
            args: {
                current_date: { type: GraphQLInt },
                _id: { type: GraphQLID },
                indicator: { type: GraphQLString },
            },
            async resolve(_, args) {
                const realDate = new Date(args.current_date*1000)
                const company_profile = await getCompanyProfileByID(args._id)
                const symbol = company_profile.ticker
                const technicals = await getTechnicalsSingle(symbol, realDate)
                const value = technicals.indicators.find(x => x.name == args.indicator).value
                return {
                    name: args.indicator,
                    value
                }
            }
        },
        technicals_single_w_next:{
            type: IndicatorWNext,
            args: {
                current_date: { type: GraphQLInt },
                plus_days: { type: GraphQLInt },
                _id: { type: GraphQLID },
                indicator: { type: GraphQLString },
            },
            async resolve(_, args) {
                const realDate = new Date(args.current_date*1000)
                const company_profile = await getCompanyProfileByID(args._id)
                const symbol = company_profile.ticker
                const technicals = await getTechnicalsSingle(symbol, realDate)
                const technicalsX = await getTechnicalsSingleFromRange(symbol, realDate, args.plus_days)
                const value = technicals.indicators.find(x => x.name == args.indicator).value
                const valueX = technicalsX.indicators.find(x => x.name == args.indicator).value
                return {
                    name: args.indicator,
                    value,
                    valueX,
                    percentChange: (valueX-value)/value*100
                }
            }
        },
        mixin: {
            type: Mixin,
            args: {
                daysMargin: { type: GraphQLInt },
                gapToEndpoint: { type: GraphQLInt },
                returnTechnicals: { type: GraphQLInt },
                lockTechnicals: { type: GraphQLInt }
            },
            resolve: async function resolve(_, args, r=0, r_threshold=9) {
                try {
                    if (r == r_threshold) throw RECURSIONEXCEEDED
                    let daysMargin, gapToEndpoint
                    if (args.daysMargin && args.gapToEndpoint) {
                        daysMargin = args.daysMargin
                        gapToEndpoint = args.gapToEndpoint
                    }
                    else {
                        const params = getRandomMarginsAndGaps()
                        daysMargin = params[0]
                        gapToEndpoint = params[1]
                    }
                    const init_date = new Date(process.env.INITIAL_DATE * 1000)
                    const difference_from_now = dateDiff(init_date, new Date(), "d")
                    const startDate = addDays(init_date, Math.floor(Math.random() * (difference_from_now-daysMargin+1)))
                    const endDate = addDays(startDate, daysMargin)
                    const tech_startDate = addDays(endDate, -1)
                    const tech_endDate = addDays(endDate, gapToEndpoint)
                    const QY = getQuarterAndYear(startDate, endDate)
                
                    const company_profile = await getRandomCompanyProfile()
                    const symbol = company_profile.ticker
                    const candles = await getCandles(symbol, startDate, endDate)
                    if (candles == []) throw NULLRESPONSE
                    const financials_reported = await getFinancialsReported(symbol, QY.year, QY.quarter)
                    if (financials_reported == null) throw NULLRESPONSE
                    const technicals = await getTechnicals(symbol, tech_startDate, tech_endDate, args.returnTechnicals, args.lockTechnicals)
                    console.log(technicals.length-1, gapToEndpoint)
                    const technicals_day0 = technicals[0]
                    if (technicals_day0 == []) throw NULLRESPONSE
                    if (candles[candles.length-1].timestamp.toString() !== technicals_day0.t.toString()) throw DATAMISMATCH
                    return {
                        startDate: tech_startDate.getTime() / 1000,
                        endDate: tech_endDate.getTime() / 1000,
                        gapToEndpoint,
                        company_profile,
                        candles,
                        financials_reported,
                        technicals_day0
                    }
                }
                catch(err) {
                    console.error(err)
                    if (err == RECURSIONEXCEEDED)
                        return
                    else
                        return resolve(_, args, r=r+1)
                }
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})