const yahooFinance = require('yahoo-finance2').default;

async function earningsHistoryController(req, res) {
    let { ticker, service } = req.query
    let data = {}
    console.log(`EarningsHistory ticker = ${ticker} service=${service}`)
    try {
        let response = await yahooFinance.quoteSummary(ticker, { modules: ["earningsHistory"] })
        data = response.earningsHistory.history        
    }
    catch (error) {
        console.log(error)
        res.json({
            resp: "n.a."
        })
        return
    }

    let structure0 = {}
    let structure1 = {}
    let structure2 = {}
    let structure3 = {}
    let fullStucture = {}

    structure0.earnHistPeriodMinus1Q = data[3].period
    structure0.earnHistQuarterEndMinus1Q = new Date(data[3].quarter).toISOString().split('T')[0]
    structure0.earnHistEpsActualMinus1Q = data[3].epsActual
    structure0.earnHistEpsEstimateMinus1Q = data[3].epsEstimate
    structure0.earnHistDiffMinus1Q = data[3].surprisePercent

    structure1.earnHistPeriodMinus2Q = data[2].period
    structure1.earnHistQuarterEndMinus2Q = new Date(data[2].quarter).toISOString().split('T')[0]
    structure1.earnHistEpsActualMinus2Q = data[2].epsActual
    structure1.earnHistEpsEstimateMinus2Q = data[2].epsEstimate
    structure1.earnHistDiffMinus2Q = data[2].surprisePercent

    structure2.earnHistPeriodMinus3Q = data[1].period
    structure2.earnHistQuarterEndMinus3Q = new Date(data[1].quarter).toISOString().split('T')[0]
    structure2.earnHistEpsActualMinus3Q = data[1].epsActual
    structure2.earnHistEpsEstimateMinus3Q = data[1].epsEstimate
    structure2.earnHistDiffMinus3Q = data[1].surprisePercent

    structure3.earnHistPeriodMinus4Q = data[0].period
    structure3.earnHistQuarterEndMinus4Q = new Date(data[0].quarter).toISOString().split('T')[0]
    structure3.earnHistEpsActualMinus4Q = data[0].epsActual
    structure3.earnHistEpsEstimateMinus4Q = data[0].epsEstimate
    structure3.earnHistDiffMinus4Q = data[0].surprisePercent

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