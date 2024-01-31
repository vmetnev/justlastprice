
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function defaultKeyStatisticsController(req, res) {

    let { ticker, service } = req.query
    console.log(`defaultKeyStatistics  ticker = ${ticker} service=${service}`)
    let data = {}

    let defaultKeyStatisticsInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "defaultKeyStatistics" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (defaultKeyStatisticsInDB && defaultKeyStatisticsInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        console.log(defaultKeyStatisticsInDB)
        data = JSON.parse(defaultKeyStatisticsInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {

            const results = await yahooFinance.quoteSummary(ticker, { modules: ["defaultKeyStatistics"] })
            data = results.defaultKeyStatistics

            // --------------------------------------------------------
            if (!defaultKeyStatisticsInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "defaultKeyStatistics",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker, moduleName: "defaultKeyStatistics" }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "defaultKeyStatistics",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                }).then(data => console.log(data))
            }
            // --------------------------------------------------------
        } catch (error) {
            console.log(error)
            res.json({
                resp: "n.a."
            })
        }
    }

    let fullStucture = {}
    let structure = {}

    structure.enterpriseValue = data.enterpriseValue
    structure.forwardPE = data.forwardPE
    structure.profitMargins = data.profitMargins
    structure.floatShares = data.floatShares
    structure.sharesOutstanding = data.sharesOutstanding
    structure.sharesShort = data.sharesShort
    structure.sharesShortPriorMonth = data.sharesShortPriorMonth
    structure.shortRatio = data.shortRatio
    structure.shortPercentOfFloat = data.shortPercentOfFloat
    structure.beta = data.beta
    structure.priceToBook = data.priceToBook

    try {
        structure.lastFiscalYearEnd = new Date(data.lastFiscalYearEnd).toISOString().split("T")[0]
    } catch (error) {
        structure.lastFiscalYearEnd = data.lastFiscalYearEnd
    }
    
    try {
        structure.nextFiscalYearEnd = new Date(data.nextFiscalYearEnd).toISOString().split("T")[0]
    } catch (error) {
        structure.nextFiscalYearEnd = data.nextFiscalYearEnd
    }

    try {
        structure.mostRecentQuarter = new Date(data.mostRecentQuarter).toISOString().split("T")[0]
    } catch (error) {
        structure.mostRecentQuarter = data.mostRecentQuarter
    }

    structure.netIncomeToCommon = data.netIncomeToCommon
    structure.trailingEps = data.trailingEps
    structure.forwardEps = data.forwardEps
    structure.enterpriseToRevenue = data.enterpriseToRevenue
    structure.enterpriseToEbitda = data.enterpriseToEbitda
    structure["52WeekChange"] = data["52WeekChange"]
    structure.enterpriseToEbitda = data.enterpriseToEbitda
    structure.totalAssets = data.totalAssets

    Object.assign(fullStucture, structure)

    fullStucture.defaultKeyStatisticsFullObject = Object.assign({}, structure)

    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])

}


module.exports = defaultKeyStatisticsController