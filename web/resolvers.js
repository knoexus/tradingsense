const { getQuarterAndYear, addDays, dateDiff } = require('./util/dates')
const { getCompanyProfile, getRandomCompanyProfile, getCandles, getFinancialsReported, 
        getTechnicals, getTechnicalsSingle, getCompanyProfileByID, getTechnicalsSingleFromRange } = require('./mongoose_actions')
const { getErrorMessage, errorTypes: { NULLRESPONSE, RECURSIONEXCEEDED, DATAMISMATCH, INSUFFICIENTDATA }  } = require('./util/errors')
const { getRandomMarginsAndGaps, getRandomSecondsAndStocks, getInitialSum } = require('./util/gameParams')

exports.companyProfileResolver = companyProfileResolver = async (_, args) => {
    if ('ticker' in args)
        return await getCompanyProfile(args.ticker)
    else return await getCompanyProfileByID(args._id)
}

exports.companyProfileRandomResolver = companyProfileRandomResolver = async () => {
    return await getRandomCompanyProfile()
}

exports.financialsReporterResolver = financialsReporterResolver = async (_, args) => {
    return await getFinancialsReported(args.symbol, args.year, args.quarter)
}

exports.candlesResolver = candlesResolver = async (_, args) => {
    const startDate = new Date(args.startDate*1000), endDate = new Date(args.endDate*1000)
    return await getCandles(args.symbol, startDate, endDate)
}

exports.technicalsResolver = technicalsResolver = async (_, args) => {
    const startDate = new Date(args.startDate*1000), endDate = new Date(args.endDate*1000)
    return await getTechnicals(args.symbol, startDate, endDate, args.returnItems, args.lockItems)
}

exports.technicalsSingleResolver = technicalsSingleResolver = async (_, args) => {
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

exports.technicalsSingleWNextResolver = technicalsSingleWNextResolver = async (_, args) => {
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
        percentChange: value == 0 ? 0 : (valueX-value)/value*100
    }
}

exports.mixinResolver = mixinResolver = async (_, args, r=0, r_threshold=9) => {
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
        // const QY = getQuarterAndYear(startDate, endDate)

        const company_profile = await getRandomCompanyProfile()
        const symbol = company_profile.ticker
        const candles = await getCandles(symbol, startDate, endDate)
        if (candles == [] || candles == null) throw NULLRESPONSE
        // const financials_reported = await getFinancialsReported(symbol, QY.year, QY.quarter)
        // if (financials_reported == null) throw NULLRESPONSE
        const technicals = await getTechnicals(symbol, tech_startDate, tech_endDate, args.returnTechnicals, args.lockTechnicals)
        if (technicals == [] || candles == null) throw NULLRESPONSE
        const technicals_day0 = technicals[0]
        if (technicals_day0 == []) throw NULLRESPONSE
        if (candles[candles.length-1].timestamp.toString() !== technicals_day0.t.toString()) throw DATAMISMATCH
        return {
            startDate: tech_startDate.getTime() / 1000,
            endDate: tech_endDate.getTime() / 1000,
            gapToEndpoint,
            daysMargin,
            company_profile,
            candles,
            technicals_day0,
            technicals
        }
    }
    catch(err) {
        console.error(err)
        if (err == RECURSIONEXCEEDED)
            return
        else
            return mixinResolver(_, args, r=r+1)
    }
}

exports.gameParamsResolver = gameParamsResolver = () => {
    const [secondsToPlay, numberOfStocks] = getRandomSecondsAndStocks()
    const initialSum = getInitialSum()
    return {
        secondsToPlay,
        numberOfStocks,
        initialSum
    }
}

exports.gameResolver = gameResolver = async (_, args) => {
    const gameParams = gameParamsResolver()
    const mixin = await mixinResolver(_, args)
    return {
        gameParams,
        mixin
    }
}