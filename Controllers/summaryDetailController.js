const yahooFinance = require('yahoo-finance2').default;

async function summaryDetailController(req, res) {
    let { ticker, service } = req.query
    let data = {}
    console.log(`summaryDetail ticker = ${ticker} service=${service}`)

    try {
        const results = await yahooFinance.quoteSummary(ticker, { modules: ["summaryDetail"] })
        data = results.summaryDetail        
    }
    catch (error) {
        console.log(error)
        res.json({
            resp: "n.a."
        })
        return
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