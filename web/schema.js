const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLSchema, GraphQLScalarType } = require('graphql')
const { getQuarterAndYear, addDays, dateDiff } = require('./util/dates')
const { getCompanyProfile, getRandomCompanyProfile, getCandles, getFinancialsReported, getTechnicals } = require('./mongoose_actions')


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
            async resolve(_, args) {
                return await getCompanyProfile(args.ticker)
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
            async resolve() {
                const days_margin = 90
                const init_date = new Date(process.env.INITIAL_DATE * 1000)
                const difference_from_now = dateDiff(init_date, new Date(), "d")
                const startDate = addDays(init_date, Math.floor(Math.random() * (difference_from_now-days_margin+1)))
                const endDate = addDays(startDate, days_margin)
                const QY = getQuarterAndYear(startDate, endDate)
                
                try {
                    const company_profile = await getRandomCompanyProfile()
                    const symbol = company_profile.ticker
                    const candles = await getCandles(symbol, startDate, endDate)
                    const financials_reported = await getFinancialsReported(symbol, QY.year, QY.quarter)
                    const technicals = await getTechnicals(symbol, startDate, endDate)
                    
                    return {
                        company_profile,
                        candles,
                        financials_reported,
                        technicals
                    }
                }
                catch(err){
                    console.error(err)
                }
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})