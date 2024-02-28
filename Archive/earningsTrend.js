
const SoftCoded = require('../Models/SoftCoded')

async function earningsTrend(req, res) {
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
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=earningsTrend&ssl=true`
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
            data = json.quoteSummary.result[0].earningsTrend.trend
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
    structureY0.earningsEndDateY0 = data[2].endDate
    structureY0.earningsEstimateAverageY0 = data[2].earningsEstimate.avg.raw
    structureY0.yearAgoEPSY0 = data[2].earningsEstimate.yearAgoEps.raw
    structureY0.earningsEstimateGrowthY0 = data[2].earningsEstimate.growth.fmt
    structureY0.numberOfAnalystsEpsEstimateY0 = data[2].earningsEstimate.numberOfAnalysts.raw
    structureY0.revenueEstimateAverageY0 = data[2].revenueEstimate.avg.raw
    structureY0.yearAgoRevenueY0 = data[2].revenueEstimate.yearAgoRevenue.raw
    structureY0.revenueEstimateGrowthY0 = data[2].revenueEstimate.growth.fmt
    structureY0.numberOfAnalystsRevenueEstimateY0 = data[2].revenueEstimate.numberOfAnalysts.raw
    structureY0.epsTrendCurrentY0 = data[2].epsTrend.current.raw
    structureY0.epsTrend7DaysAgoY0 = data[2].epsTrend['7daysAgo'].raw
    structureY0.epsTrend30DaysAgoY0 = data[2].epsTrend['30daysAgo'].raw
    structureY0.epsTrend90DaysAgoY0 = data[2].epsTrend['90daysAgo'].raw

    structureY1.earningsPeriodY1 = data[3].period
    structureY1.earningsEndDateY1 = data[3].endDate
    structureY1.earningsEstimateAverageY1 = data[3].earningsEstimate.avg.raw
    structureY1.yearAgoEPSY1 = data[3].earningsEstimate.yearAgoEps.raw
    structureY1.earningsEstimateGrowthY1 = data[3].earningsEstimate.growth.fmt
    structureY1.numberOfAnalystsEpsEstimateY1 = data[3].earningsEstimate.numberOfAnalysts.raw
    structureY1.revenueEstimateAverageY1 = data[3].revenueEstimate.avg.raw
    structureY1.yearAgoRevenueY1 = data[3].revenueEstimate.yearAgoRevenue.raw
    structureY1.revenueEstimateGrowthY1 = data[3].revenueEstimate.growth.fmt
    structureY1.numberOfAnalystsRevenueEstimateY1 = data[3].revenueEstimate.numberOfAnalysts.raw
    structureY1.epsTrendCurrentY1 = data[3].epsTrend.current.raw
    structureY1.epsTrend7DaysAgoY1 = data[3].epsTrend['7daysAgo'].raw
    structureY1.epsTrend30DaysAgoY1 = data[3].epsTrend['30daysAgo'].raw
    structureY1.epsTrend90DaysAgoY1 = data[3].epsTrend['90daysAgo'].raw

    structureQ0.earningsPeriodQ0 = data[0].period
    structureQ0.earningsEndDateQ0 = data[0].endDate
    structureQ0.earningsEstimateAverageQ0 = data[0].earningsEstimate.avg.raw
    structureQ0.yearAgoEPSQ0 = data[0].earningsEstimate.yearAgoEps.raw
    structureQ0.earningsEstimateGrowthQ0 = data[0].earningsEstimate.growth.fmt
    structureQ0.numberOfAnalystsEpsEstimateQ0 = data[0].earningsEstimate.numberOfAnalysts.raw
    structureQ0.revenueEstimateAverageQ0 = data[0].revenueEstimate.avg.raw
    structureQ0.yearAgoRevenueQ0 = data[0].revenueEstimate.yearAgoRevenue.raw
    structureQ0.revenueEstimateGrowthQ0 = data[0].revenueEstimate.growth.fmt
    structureQ0.numberOfAnalystsRevenueEstimateQ0 = data[0].revenueEstimate.numberOfAnalysts.raw
    structureQ0.epsTrendCurrentQ0 = data[0].epsTrend.current.raw
    structureQ0.epsTrend7DaysAgoQ0 = data[0].epsTrend['7daysAgo'].raw
    structureQ0.epsTrend30DaysAgoQ0 = data[0].epsTrend['30daysAgo'].raw
    structureQ0.epsTrend90DaysAgoQ0 = data[0].epsTrend['90daysAgo'].raw

    structureQ1.earningsPeriodQ1 = data[1].period
    structureQ1.earningsEndDateQ1 = data[1].endDate
    structureQ1.earningsEstimateAverageQ1 = data[1].earningsEstimate.avg.raw
    structureQ1.yearAgoEPSQ1 = data[1].earningsEstimate.yearAgoEps.raw
    structureQ1.earningsEstimateGrowthQ1 = data[1].earningsEstimate.growth.fmt
    structureQ1.numberOfAnalystsEpsEstimateQ1 = data[1].earningsEstimate.numberOfAnalysts.raw
    structureQ1.revenueEstimateAverageQ1 = data[1].revenueEstimate.avg.raw
    structureQ1.yearAgoRevenueQ1 = data[1].revenueEstimate.yearAgoRevenue.raw
    structureQ1.revenueEstimateGrowthQ1 = data[1].revenueEstimate.growth.fmt
    structureQ1.numberOfAnalystsRevenueEstimateQ1 = data[1].revenueEstimate.numberOfAnalysts.raw
    structureQ1.epsTrendCurrentQ1 = data[1].epsTrend.current.raw
    structureQ1.epsTrend7DaysAgoQ1 = data[1].epsTrend['7daysAgo'].raw
    structureQ1.epsTrend30DaysAgoQ1 = data[1].epsTrend['30daysAgo'].raw
    structureQ1.epsTrend90DaysAgoQ1 = data[1].epsTrend['90daysAgo'].raw

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

module.exports = earningsTrend