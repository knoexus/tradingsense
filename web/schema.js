const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLID, GraphQLSchema, GraphQLScalarType } = require('graphql')
const { getQuarterAndYear, addDays, dateDiff } = require('./util/dates')
const { getCompanyProfile, getRandomCompanyProfile, getCandles, getFinancialsReported, 
        getTechnicals, getTechnicalsSingle, getCompanyProfileByID } = require('./mongoose_actions')
const { getErrorMessage, errorTypes: { NULLRESPONSE, RECURSIONEXCEEDED}  } = require('./util/errors')
const { getSplitTechnicals } = require('./util/technicals') 

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

const Indicators = new GraphQLObjectType({
    name: 'Indicators',
    fields: () => ({
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
 
const Technicals = new GraphQLObjectType({
    name: 'Technicals',
    fields: () => ({
        symbol: { type: GraphQLString },
        t: { type: DateTime },
        indicators: { type: Indicators }
    })
})
 
const Mixin = new GraphQLObjectType({
    name: 'Mixin',
    fields: () => ({
        startDate: { type: GraphQLInt },
        endDate: { type: GraphQLInt },
        gap_to_endpoint: { type: GraphQLInt },
        company_profile: { type: CompanyProfile },
        candles: { type: new GraphQLList(Candle) },
        financials_reported: { type: FinancialsReported },
        technicals: { type: new GraphQLList(Technicals) }
    })
})

const Split_Technicals_Names = new GraphQLObjectType({
    name: 'Split_Technicals_Names',
    fields: () => ({
        locked: { type: new GraphQLList(GraphQLString) },
        unlocked: { type: new GraphQLList(GraphQLString) }
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
                endDate: { type: GraphQLInt }
            },
            async resolve(_, args) {
                const startDate = new Date(args.startDate*1000), endDate = new Date(args.endDate*1000)
                return await getTechnicals(args.symbol, startDate, endDate)
            }
        },
        technicals_single: {
            type: Technicals,
            args: {
                symbol: { type: GraphQLString },
                date: { type: GraphQLInt },
            },
            async resolve(_, args) {
                const date = new Date(args.date*1000)
                return await getTechnicalsSingle(args.symbol, date)
            }
        },
        technicals_names: {
            type: Split_Technicals_Names,
            args: {
                takeInPercent: { type: GraphQLFloat },
                lockedFromTakeInPercent: { type: GraphQLFloat }
            },
            resolve(_, args) {
                return getSplitTechnicals(args.takeInPercent, args.lockedFromTakeInPercent)
            }
        },
        mixin: {
            type: Mixin,
            args: {
                symbol: { type: GraphQLString },
                startDate: { type: GraphQLInt },
                endDate: { type: GraphQLInt }
            },
            async resolve(_, args) {
                const startDate = new Date(args.startDate*1000), endDate = new Date(args.endDate*1000)
                const QY = getQuarterAndYear(startDate, endDate)

                const company_profile = getCompanyProfile(args.symbol).then(company_profile => ({ company_profile }))
                const candles = getCandles(args.symbol, startDate, endDate).then(candles => ({ candles }))
                const financials_reported = getFinancialsReported(args.symbol, QY.year, QY.quarter).then(financials_reported => ({ financials_reported }))
                const technicals = getTechnicals(args.symbol, startDate, endDate).then(technicals => ({ technicals }))
                return await Promise.all([company_profile, candles, financials_reported, technicals])
                    .then(vals => {
                        return vals.reduce((acc, current) => {
                            const key = Object.keys(current)[0] 
                            acc[key] = current[key]
                            return acc
                        }, {})
                    })
            }
        },
        mixinArgless: {
            type: Mixin,
            resolve: async function resolve(r=0, r_threshold=7) {
                try {
                    if (r == r_threshold) throw RECURSIONEXCEEDED
                    const days_margin = 90
                    const init_date = new Date(process.env.INITIAL_DATE * 1000)
                    const difference_from_now = dateDiff(init_date, new Date(), "d")
                    const startDate = addDays(init_date, Math.floor(Math.random() * (difference_from_now-days_margin+1)))
                    const endDate = addDays(startDate, days_margin)
                    const QY = getQuarterAndYear(startDate, endDate)
                
                    const company_profile = await getRandomCompanyProfile()
                    const symbol = company_profile.ticker
                    const candles = await getCandles(symbol, startDate, endDate)
                    if (candles == []) throw NULLRESPONSE
                    const financials_reported = await getFinancialsReported(symbol, QY.year, QY.quarter)
                    if (financials_reported == null) throw NULLRESPONSE
                    const technicals = await getTechnicals(symbol, startDate, endDate)
                    if (candles == []) throw NULLRESPONSE
                    
                    return {
                        startDate: startDate.getTime() / 1000,
                        endDate: endDate.getTime() / 1000,
                        gap_to_endpoint: 30,
                        company_profile,
                        candles,
                        financials_reported,
                        technicals
                    }
                }
                catch(err) {
                    console.error(err)
                    if (err == RECURSIONEXCEEDED)
                        return
                    else
                        return resolve(r+1)
                }
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})