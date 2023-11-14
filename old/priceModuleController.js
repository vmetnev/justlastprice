const SoftCoded = require('../Models/SoftCoded')

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
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=price&ssl=true`
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
            data = json.quoteSummary.result[0].price
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

    structure.preMarketChangePercent = (data.preMarketChangePercent) ? data.preMarketChangePercent.fmt : 'n.a.'
    structure.preMarketPrice = (data.preMarketPrice) ? data.preMarketPrice.fmt : "n.a."
    structure.postMarketPrice = (data.postMarketPrice) ? data.postMarketPrice.fmt : 'n.a.'
    structure.regularMarketChangePercent = data.regularMarketChangePercent.fmt
    structure.regularMarketTime = data.regularMarketTime
    structure.regularMarketPrice = data.regularMarketPrice.fmt
    structure.regularMarketDayHigh = data.regularMarketDayHigh.fmt
    structure.regularMarketDayLow = data.regularMarketDayLow.fmt
    structure.regularMarketVolume = data.regularMarketVolume.raw
    structure.regularMarketPreviousClose = data.regularMarketPreviousClose.fmt
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