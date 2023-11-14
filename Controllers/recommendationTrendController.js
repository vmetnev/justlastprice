
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function recommendationTrendController(req, res) {
    let { ticker, service } = req.query

    let data = {}

    console.log(`RecommendationTrend ticker = ${ticker} service=${service}`)

    let recTrendObjectInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "recommendationTrend" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (recTrendObjectInDB && recTrendObjectInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        console.log(recTrendObjectInDB)
        data = JSON.parse(recTrendObjectInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')

        try {
            const results = await yahooFinance.quoteSummary(ticker, { modules: ["recommendationTrend"] })

            data = results.recommendationTrend.trend

            if (!recTrendObjectInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "recommendationTrend",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "recommendationTrend",
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
        }
    }




    let structure0 = {}
    let structure1 = {}
    let structure2 = {}
    let structure3 = {}
    let fullStucture = {}

    structure0.recPeriod0 = data[0].period
    structure0.strongBuy0 = data[0].strongBuy
    structure0.buy0 = data[0].buy
    structure0.hold0 = data[0].hold
    structure0.sell0 = data[0].sell
    structure0.strongSell0 = data[0].strongSell

    structure1.recPeriodMinus1M = data[1].period
    structure1.strongBuyMinus1M = data[1].strongBuy
    structure1.buyMinus1M = data[1].buy
    structure1.holdMinus1M = data[1].hold
    structure1.sellMinus1M = data[1].sell
    structure1.strongSellMinus1M = data[1].strongSell

    structure2.recPeriodMinus2M = data[2].period
    structure2.strongBuyMinus2M = data[2].strongBuy
    structure2.buyMinus2M = data[2].buy
    structure2.holdMinus2M = data[2].hold
    structure2.sellMinus2M = data[2].sell
    structure2.strongSellMinus2M = data[2].strongSell

    structure3.recPeriodMinus3M = data[3].period
    structure3.strongBuyMinus3M = data[3].strongBuy
    structure3.buyMinus3M = data[3].buy
    structure3.holdMinus3M = data[3].hold
    structure3.sellMinus3M = data[3].sell
    structure3.strongSellMinus3M = data[3].strongSell

    Object.assign(fullStucture, structure0, structure1, structure2, structure3)

    fullStucture['recommendationTrendFullObject'] = Object.assign({}, structure0, structure1, structure2, structure3)

    fullStucture['recPeriod0FullObject'] = structure0
    fullStucture['recPeriodMinus1MFullObject'] = structure1
    fullStucture['recPeriodMinus2MFullObject'] = structure2
    fullStucture['recPeriodMinus3MFullObject'] = structure3


    console.log(service)
    console.log(req.query)
    console.log(fullStucture[service])

    // switch (service) {
    //     case 'recommendationTrendFullObject':
    //         res.json(fullStucture)
    //         break

    //     case 'recPeriod0FullObject':
    //         res.json(structure0)
    //         break
    //     case 'recPeriodMinus1MFullObject':
    //         res.json(structure1)
    //         break
    //     case 'recPeriodMinus2MFullObject':
    //         res.json(structure2)
    //         break
    //     case 'recPeriodMinus3MFullObject':
    //         res.json(structure3)
    //         break
    //     default:
    //         res.json(fullStucture[service])
    // }

    res.json(fullStucture[service])
}

module.exports = recommendationTrendController