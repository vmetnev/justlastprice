
const SoftCoded = require('../Models/SoftCoded')

async function defaultKeyStatisticsController(req, res) {

    let { ticker, service } = req.query
    console.log(`defaultKeyStatistics  ticker = ${ticker} service=${service}`)
    let data = {}

    let defaultKeyStatisticsInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "defaultKeyStatistics" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (defaultKeyStatisticsInDB && defaultKeyStatisticsInDB.date.slice(0, 4) === new Date().toISOString().split('T')[0].slice(0, 4)) {
        console.log('serving from memory')
        console.log(defaultKeyStatisticsInDB)
        data = JSON.parse(defaultKeyStatisticsInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics&ssl=true`
            console.log(url)
            let response = await fetch(url, {
                headers: {
                    'Host': 'query2.finance.yahoo.com'
                }
            });
            if (response.statusText != "OK") {
                res.send("failed fetch")
                return
            }

            const json = await response.json()
            data = json.quoteSummary.result[0].defaultKeyStatistics
            console.log(data)

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
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "defaultKeyStatistics",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
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

    structure.enterpriseValue = data.enterpriseValue.raw
    structure.forwardPE = data.forwardPE.fmt
    structure.profitMargins = data.profitMargins.fmt
    structure.floatShares = data.floatShares.raw
    structure.sharesOutstanding = data.sharesOutstanding.raw
    structure.sharesShort = data.sharesShort.raw
    structure.sharesShortPriorMonth = data.sharesShortPriorMonth.raw
    structure.shortRatio = data.shortRatio.fmt
    structure.shortPercentOfFloat = data.shortPercentOfFloat.fmt
    structure.beta = data.beta.fmt
    structure.priceToBook = data.priceToBook.fmt
    structure.lastFiscalYearEnd = data.lastFiscalYearEnd.fmt
    structure.nextFiscalYearEnd = data.nextFiscalYearEnd.fmt
    structure.mostRecentQuarter = data.mostRecentQuarter.fmt
    structure.netIncomeToCommon = data.netIncomeToCommon.raw
    structure.trailingEps = data.trailingEps.fmt
    structure.forwardEps = data.forwardEps.fmt
    structure.enterpriseToRevenue= data.enterpriseToRevenue.fmt
    structure.enterpriseToEbitda = data.enterpriseToEbitda.fmt
    structure["52WeekChange"] = data["52WeekChange"].fmt
    structure.enterpriseToEbitda = data.enterpriseToEbitda.fmt

    Object.assign(fullStucture, structure)

    fullStucture.defaultKeyStatisticsFullObject = Object.assign({}, structure)

    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])

}


module.exports = defaultKeyStatisticsController