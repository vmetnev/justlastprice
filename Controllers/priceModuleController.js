const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function priceModuleController(req, res) {
    let { ticker, service } = req.query
    console.log(`price  ticker = ${ticker} service=${service}`)
    let data = {}

    let priceInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "price" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (priceInDB && priceInDB.date.slice(0, 4) === new Date().toISOString().split('T')[0].slice(0, 4)) {
        console.log('serving from memory')
        console.log(priceInDB)
        data = JSON.parse(priceInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {

            const results = await yahooFinance.quoteSummary(ticker, { modules: ["price"] })
            data = results.price
            console.log(data)

            // --------------------------------------------------------
            if (!priceInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "price",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "price",
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

    structure.preMarketChangePercent = (data.preMarketChangePercent) ? data.preMarketChangePercent : 'n.a.'
    structure.preMarketPrice = (data.preMarketPrice) ? data.preMarketPrice : "n.a."
    structure.postMarketPrice = (data.postMarketPrice) ? data.postMarketPrice : 'n.a.'
    structure.regularMarketChangePercent = data.regularMarketChangePercent
    structure.regularMarketTime = new Date(data.regularMarketTime).toISOString().split("T")[0] + " - " + new Date(data.regularMarketTime).toISOString().split("T")[1].substring(0,8);
    structure.regularMarketPrice = data.regularMarketPrice
    structure.regularMarketDayHigh = data.regularMarketDayHigh
    structure.regularMarketDayLow = data.regularMarketDayLow
    structure.regularMarketVolume = data.regularMarketVolume
    structure.regularMarketPreviousClose = data.regularMarketPreviousClose
    structure.marketState = data.marketState
    structure.quoteType = data.quoteType
    structure.symbol = data.symbol
    structure.longName = data.longName
    structure.tradingCurrency = data.currency
    structure.marketCap = data.marketCap

    Object.assign(fullStucture, structure)
    fullStucture.priceFullObject = Object.assign({}, structure)

    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])

}


module.exports = priceModuleController