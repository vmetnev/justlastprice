const SoftCoded = require('../Models/SoftCoded')

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
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=summaryDetail&ssl=true`
            console.log(url)
            let response = await fetch(url, {
                headers: {
                    'Host': 'query2.finance.yahoo.com'
                }
            });

            console.log(response.statusText)

            if (response.statusText != "OK") {
                res.send("failed fetch")
                return
            }

            const json = await response.json()
            data = json.quoteSummary.result[0].summaryDetail

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

    

    structure.averageDailyVolume10Day = data.averageDailyVolume10Day.raw
    structure.summaryBeta = data.beta.fmt
    structure.dayHigh = data.dayHigh.fmt
    structure.dayLow = data.dayLow.fmt
    structure.dividendRate = data.dividendRate.fmt
    structure.dividendYield = data.dividendYield.fmt
    structure.fiftyDayAverage = data.fiftyDayAverage.fmt
    structure.fiftyTwoWeekHigh = data.fiftyTwoWeekHigh.fmt
    structure.fiftyTwoWeekLow = data.fiftyTwoWeekLow.fmt
    structure.fiveYearAvgDividendYield = data.fiveYearAvgDividendYield.fmt
    structure.summaryForwardPE = data.forwardPE.fmt
    structure.summaryMarketCap = data.marketCap.raw
    structure.openPrice = data['open'].fmt
    structure.payoutRatio = data.payoutRatio.fmt
    structure.previousClose = data.previousClose.fmt
    structure.summaryRegularMarketDayHigh = data.regularMarketDayHigh.fmt
    structure.summaryRegularMarketDayLow = data.regularMarketDayLow.fmt
    structure.regularMarketOpen = data.regularMarketOpen.fmt
    structure.summaryRegularMarketPreviousClose = data.regularMarketPreviousClose.fmt
    structure.trailingAnnualDividendRate = data.trailingAnnualDividendRate.fmt
    structure.trailingAnnualDividendYield = data.trailingAnnualDividendYield.fmt
    structure.trailingPE = data.trailingPE.fmt
    structure.twoHundredDayAverage = data.twoHundredDayAverage.fmt




    Object.assign(fullStucture, structure)
    fullStucture['summaryDetailFullObject'] = Object.assign({}, structure)
    console.log(service)
    console.log(req.query)
    console.log(fullStucture[service])

    res.json(fullStucture[service])
}



module.exports = summaryDetailController