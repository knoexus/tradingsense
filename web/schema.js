const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLID, 
        GraphQLSchema, GraphQLScalarType } = require('graphql')
const resolvers = require('./resolvers')

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
        daysMargin: { type: GraphQLInt },
        company_profile: { type: CompanyProfile },
        candles: { type: new GraphQLList(Candle) },
        financials_reported: { type: FinancialsReported },
        technicals_day0: { type: Technicals },
        technicals: { type: new GraphQLList(Technicals) }
    })
})

const GameParams = new GraphQLObjectType({
    name: 'GameParams',
    fields: () => ({
        secondsToPlay: { type: GraphQLInt },
        numberOfStocks: { type: GraphQLInt },
    })
})

const Game = new GraphQLObjectType({
    name: 'Game',
    fields: () => ({
        gameParams: { type: GameParams },
        mixin: { type: Mixin }
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
            resolve: resolvers.companyProfileResolver
        },
        company_profile_random: {
            type: CompanyProfile,
            resolve: resolvers.companyProfileRandomResolver
        },
        financials_reported: {
            type: FinancialsReported,
            args: {
                symbol: { type: GraphQLString },
                year: { type: GraphQLInt },
                quarter: { type: GraphQLInt }
            },
            resolve: resolvers.financialsReportedResolver
        },
        candles: {
            type: new GraphQLList(Candle),
            args: {
                symbol: { type: GraphQLString },
                startDate: { type: GraphQLInt },
                endDate: { type: GraphQLInt }
            },
            resolve: resolvers.candlesResolver
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
            resolve: resolvers.technicalsResolver
        },
        technicals_single: {
            type: Indicator,
            args: {
                current_date: { type: GraphQLInt },
                _id: { type: GraphQLID },
                indicator: { type: GraphQLString },
            },
            resolve: resolvers.technicalsSingleResolver
        },
        technicals_single_w_next:{
            type: IndicatorWNext,
            args: {
                current_date: { type: GraphQLInt },
                plus_days: { type: GraphQLInt },
                _id: { type: GraphQLID },
                indicator: { type: GraphQLString },
            },
            resolve: resolvers.technicalsSingleWNextResolver
        },
        mixin: {
            type: Mixin,
            args: {
                daysMargin: { type: GraphQLInt },
                gapToEndpoint: { type: GraphQLInt },
                returnTechnicals: { type: GraphQLInt },
                lockTechnicals: { type: GraphQLInt }
            },
            resolve: resolvers.mixinResolver
        },
        game: {
            type: Game,
            args: {
                daysMargin: { type: GraphQLInt },
                gapToEndpoint: { type: GraphQLInt },
                returnTechnicals: { type: GraphQLInt },
                lockTechnicals: { type: GraphQLInt }
            },
            resolve: resolvers.gameResolver
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})