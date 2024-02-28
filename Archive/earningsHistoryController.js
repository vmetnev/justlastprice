const SoftCoded = require('../Models/SoftCoded')

async function earningsHistoryController(req, res) {

    let { ticker, service } = req.query

    let data = {}

    console.log(`EarningsHistory ticker = ${ticker} service=${service}`)

    let earningsHistoryObjectInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "earningsHistory" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (earningsHistoryObjectInDB && earningsHistoryObjectInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        console.log(earningsHistoryObjectInDB)
        data = JSON.parse(earningsHistoryObjectInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')

        try {
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=earningsHistory&ssl=true`
            console.log(url)
            let response = await fetch(url, {
                headers: {
                    'Host': 'query2.finance.yahoo.com',
                }
            });

            console.log(response.statusText)

            if (response.statusText != "OK") {
                res.send("failed fetch")
                return
            }

            const json = await response.json()
            data = json.quoteSummary.result[0].earningsHistory.history

            if (!earningsHistoryObjectInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "earningsHistory",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'today'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "earningsHistory",
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

    let structure0 = {}
    let structure1 = {}
    let structure2 = {}
    let structure3 = {}
    let fullStucture = {}

    structure0.earnHistPeriodMinus1Q = data[0].period
    structure0.earnHistQuarterEndMinus1Q = data[0].quarter.fmt
    structure0.earnHistEpsActualMinus1Q = data[0].epsActual.fmt
    structure0.earnHistEpsEstimateMinus1Q = data[0].epsEstimate.fmt
    structure0.earnHistDiffMinus1Q = data[0].surprisePercent.fmt

    structure1.earnHistPeriodMinus2Q = data[1].period
    structure1.earnHistQuarterEndMinus2Q = data[1].quarter.fmt
    structure1.earnHistEpsActualMinus2Q = data[1].epsActual.fmt
    structure1.earnHistEpsEstimateMinus2Q = data[1].epsEstimate.fmt
    structure1.earnHistDiffMinus2Q = data[1].surprisePercent.fmt

    structure2.earnHistPeriodMinus3Q = data[2].period
    structure2.earnHistQuarterEndMinus3Q = data[2].quarter.fmt
    structure2.earnHistEpsActualMinus3Q = data[2].epsActual.fmt
    structure2.earnHistEpsEstimateMinus3Q = data[2].epsEstimate.fmt
    structure2.earnHistDiffMinus3Q = data[2].surprisePercent.fmt

    structure3.earnHistPeriodMinus4Q = data[3].period
    structure3.earnHistQuarterEndMinus4Q = data[3].quarter.fmt
    structure3.earnHistEpsActualMinus4Q = data[3].epsActual.fmt
    structure3.earnHistEpsEstimateMinus4Q = data[3].epsEstimate.fmt
    structure3.earnHistDiffMinus4Q = data[3].surprisePercent.fmt

    Object.assign(fullStucture, structure0, structure1, structure2, structure3)

    fullStucture['earningsHistoryFullObject'] = Object.assign({}, structure0, structure1, structure2, structure3)
    fullStucture['earningsHistoryMinus1QFullObject'] = structure0
    fullStucture['earningsHistoryMinus2QFullObject'] = structure1
    fullStucture['earningsHistoryMinus3QFullObject'] = structure2
    fullStucture['earningsHistoryMinus4QFullObject'] = structure3

    console.log(service)
    console.log(req.query)
    console.log(fullStucture[service])

    res.json(fullStucture[service])
}


module.exports = earningsHistoryController