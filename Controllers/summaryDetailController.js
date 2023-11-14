const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function summaryDetailController(req, res) {

    let { ticker, service } = req.query

    let data = {}

    console.log(`summaryDetail ticker = ${ticker} service=${service}`)

    let summaryDetailObjectInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "summaryDetail" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (summaryDetailObjectInDB && summaryDetailObjectInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        console.log(summaryDetailObjectInDB)

        data = JSON.parse(summaryDetailObjectInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')

        try {
            
            const results = await yahooFinance.quoteSummary(ticker, { modules: [ "summaryDetail" ] })
            
            data = results.summaryDetail

            if (!summaryDetailObjectInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "summaryDetail",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "summaryDetail",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
            }
        }
        catch (error) {
            console.log(error)
            res.json({
                resp: "n.a."
            })
            return
        }


    }

    let structure = {}

    let fullStucture = {}

    

    structure.averageDailyVolume10Day = data.averageDailyVolume10Day
    structure.summaryBeta = data.beta
    structure.dayHigh = data.dayHigh
    structure.dayLow = data.dayLow
    structure.dividendRate = data.dividendRate
    structure.dividendYield = data.dividendYield
    structure.fiftyDayAverage = data.fiftyDayAverage
    structure.fiftyTwoWeekHigh = data.fiftyTwoWeekHigh
    structure.fiftyTwoWeekLow = data.fiftyTwoWeekLow
    structure.fiveYearAvgDividendYield = data.fiveYearAvgDividendYield
    structure.summaryForwardPE = data.forwardPE
    structure.summaryMarketCap = data.marketCap
    structure.openPrice = data['open']
    structure.payoutRatio = data.payoutRatio
    structure.previousClose = data.previousClose
    structure.summaryRegularMarketDayHigh = data.regularMarketDayHigh
    structure.summaryRegularMarketDayLow = data.regularMarketDayLow
    structure.regularMarketOpen = data.regularMarketOpen
    structure.summaryRegularMarketPreviousClose = data.regularMarketPreviousClose
    structure.trailingAnnualDividendRate = data.trailingAnnualDividendRate
    structure.trailingAnnualDividendYield = data.trailingAnnualDividendYield
    structure.trailingPE = data.trailingPE
    structure.twoHundredDayAverage = data.twoHundredDayAverage




    Object.assign(fullStucture, structure)
    fullStucture['summaryDetailFullObject'] = Object.assign({}, structure)
    console.log(service)
    console.log(req.query)
    console.log(fullStucture[service])

    res.json(fullStucture[service])
}



module.exports = summaryDetailController