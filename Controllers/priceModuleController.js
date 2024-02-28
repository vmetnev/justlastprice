
const yahooFinance = require('yahoo-finance2').default;

async function priceModuleController(req, res) {
    let { ticker, service } = req.query
    console.log(`price  ticker = ${ticker} service=${service} module=priceModuleController`)

    let data = {}

    try {
        const results = await yahooFinance.quoteSummary(ticker, { modules: ["price"] })
        data = results.price
    } catch (error) {
        console.log(error)
            res.json({
                resp: "n.a."
            })
    }



    let fullStucture = {}
    let structure = {}
    console.log(data)
    structure.preMarketChangePercent = (data.preMarketChangePercent) ? data.preMarketChangePercent : 'n.a.'
    structure.preMarketPrice = (data.preMarketPrice) ? data.preMarketPrice : "n.a."
    structure.postMarketPrice = (data.postMarketPrice) ? data.postMarketPrice : 'n.a.'
    structure.regularMarketChangePercent = data.regularMarketChangePercent

    try {
        structure.regularMarketTime = new Date(data.regularMarketTime).toISOString().split("T")[0] + " - " + new Date(data.regularMarketTime).toISOString().split("T")[1].substring(0, 8);
    } catch (error) {
        structure.regularMarketTime = data.regularMarketTime
    }

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
    res.json(fullStucture[service])
}

module.exports = priceModuleController