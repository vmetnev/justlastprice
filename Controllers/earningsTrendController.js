
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function earningsTrendController(req, res) {
    let { ticker, service } = req.query
    console.log(`EarningsTrend ticker = ${ticker} service=${service}`)
    let data = {}

    let earningsTrendObjectInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "earningsTrend" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')


    if (earningsTrendObjectInDB && earningsTrendObjectInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        console.log(earningsTrendObjectInDB)
        data = JSON.parse(earningsTrendObjectInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {

            let response = await yahooFinance.quoteSummary(ticker, { modules: ["earningsTrend"] })

            // if (response.statusText != "OK") {
            //     res.send("failed fetch")
            //     return
            // }


            data = response.earningsTrend.trend
            console.log(data)

            // --------------------------------------------------------
            if (!earningsTrendObjectInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "earningsTrend",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "earningsTrend",
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

    let structureY0 = {}
    let structureY1 = {}
    let structureQ0 = {}
    let structureQ1 = {}
    let fullStucture = {}

    structureY0.earningsPeriodY0 = data[2].period
    structureY0.earningsEndDateY0 = new Date(data[2].endDate).toISOString().split('T')[0]
    structureY0.earningsEstimateAverageY0 = data[2].earningsEstimate.avg
    structureY0.yearAgoEPSY0 = data[2].earningsEstimate.yearAgoEps
    structureY0.earningsEstimateGrowthY0 = data[2].earningsEstimate.growth
    structureY0.numberOfAnalystsEpsEstimateY0 = data[2].earningsEstimate.numberOfAnalysts
    structureY0.revenueEstimateAverageY0 = data[2].revenueEstimate.avg
    structureY0.yearAgoRevenueY0 = data[2].revenueEstimate.yearAgoRevenue
    structureY0.revenueEstimateGrowthY0 = data[2].revenueEstimate.growth
    structureY0.numberOfAnalystsRevenueEstimateY0 = data[2].revenueEstimate.numberOfAnalysts
    structureY0.epsTrendCurrentY0 = data[2].epsTrend.current
    structureY0.epsTrend7DaysAgoY0 = data[2].epsTrend['7daysAgo']
    structureY0.epsTrend30DaysAgoY0 = data[2].epsTrend['30daysAgo']
    structureY0.epsTrend90DaysAgoY0 = data[2].epsTrend['90daysAgo']

    structureY1.earningsPeriodY1 = data[3].period
    structureY1.earningsEndDateY1 = new Date(data[3].endDate).toISOString().split('T')[0]
    structureY1.earningsEstimateAverageY1 = data[3].earningsEstimate.avg
    structureY1.yearAgoEPSY1 = data[3].earningsEstimate.yearAgoEps
    structureY1.earningsEstimateGrowthY1 = data[3].earningsEstimate.growth
    structureY1.numberOfAnalystsEpsEstimateY1 = data[3].earningsEstimate.numberOfAnalysts
    structureY1.revenueEstimateAverageY1 = data[3].revenueEstimate.avg
    structureY1.yearAgoRevenueY1 = data[3].revenueEstimate.yearAgoRevenue
    structureY1.revenueEstimateGrowthY1 = data[3].revenueEstimate.growth
    structureY1.numberOfAnalystsRevenueEstimateY1 = data[3].revenueEstimate.numberOfAnalysts
    structureY1.epsTrendCurrentY1 = data[3].epsTrend.current
    structureY1.epsTrend7DaysAgoY1 = data[3].epsTrend['7daysAgo']
    structureY1.epsTrend30DaysAgoY1 = data[3].epsTrend['30daysAgo']
    structureY1.epsTrend90DaysAgoY1 = data[3].epsTrend['90daysAgo']

    structureQ0.earningsPeriodQ0 = data[0].period
    structureQ0.earningsEndDateQ0 = new Date(data[0].endDate).toISOString().split('T')[0]
    structureQ0.earningsEstimateAverageQ0 = data[0].earningsEstimate.avg
    structureQ0.yearAgoEPSQ0 = data[0].earningsEstimate.yearAgoEps
    structureQ0.earningsEstimateGrowthQ0 = data[0].earningsEstimate.growth
    structureQ0.numberOfAnalystsEpsEstimateQ0 = data[0].earningsEstimate.numberOfAnalysts
    structureQ0.revenueEstimateAverageQ0 = data[0].revenueEstimate.avg
    structureQ0.yearAgoRevenueQ0 = data[0].revenueEstimate.yearAgoRevenue
    structureQ0.revenueEstimateGrowthQ0 = data[0].revenueEstimate.growth
    structureQ0.numberOfAnalystsRevenueEstimateQ0 = data[0].revenueEstimate.numberOfAnalysts
    structureQ0.epsTrendCurrentQ0 = data[0].epsTrend.current
    structureQ0.epsTrend7DaysAgoQ0 = data[0].epsTrend['7daysAgo']
    structureQ0.epsTrend30DaysAgoQ0 = data[0].epsTrend['30daysAgo']
    structureQ0.epsTrend90DaysAgoQ0 = data[0].epsTrend['90daysAgo']

    structureQ1.earningsPeriodQ1 = data[1].period
    structureQ1.earningsEndDateQ1 = new Date(data[1].endDate).toISOString().split('T')[0]
    structureQ1.earningsEstimateAverageQ1 = data[1].earningsEstimate.avg
    structureQ1.yearAgoEPSQ1 = data[1].earningsEstimate.yearAgoEps
    structureQ1.earningsEstimateGrowthQ1 = data[1].earningsEstimate.growth
    structureQ1.numberOfAnalystsEpsEstimateQ1 = data[1].earningsEstimate.numberOfAnalysts
    structureQ1.revenueEstimateAverageQ1 = data[1].revenueEstimate.avg
    structureQ1.yearAgoRevenueQ1 = data[1].revenueEstimate.yearAgoRevenue
    structureQ1.revenueEstimateGrowthQ1 = data[1].revenueEstimate.growth
    structureQ1.numberOfAnalystsRevenueEstimateQ1 = data[1].revenueEstimate.numberOfAnalysts
    structureQ1.epsTrendCurrentQ1 = data[1].epsTrend.current
    structureQ1.epsTrend7DaysAgoQ1 = data[1].epsTrend['7daysAgo']
    structureQ1.epsTrend30DaysAgoQ1 = data[1].epsTrend['30daysAgo']
    structureQ1.epsTrend90DaysAgoQ1 = data[1].epsTrend['90daysAgo']

    Object.assign(fullStucture, structureY0, structureY1, structureQ0, structureQ1)
    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')
    switch (service) {
        case 'earningsTrendFullObject':
            res.json(fullStucture)
            break

        case 'fullObjectY0':
            res.json(structureY0)
            break
        case 'fullObjectY1':
            res.json(structureY1)
            break
        case 'fullObjectQ0':
            res.json(structureQ0)
            break
        case 'fullObjectQ1':
            res.json(structureQ1)
            break
        default:
            res.json(fullStucture[service])
    }
}

module.exports = earningsTrendController