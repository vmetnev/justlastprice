
const yahooFinance = require('yahoo-finance2').default;

async function calendarEventsController(req, res) {

    let { ticker, service } = req.query
    console.log(`calendarEvents  ticker = ${ticker} service=${service}`)
    let data = {}

    try {
        const results = await yahooFinance.quoteSummary(ticker, { modules: ["calendarEvents"] })
        data = results.calendarEvents.earnings
        console.log(data)
    } catch (error) {
        console.log(error)
        sent = true
        res.json({
            resp: "n.a."
        })
        return
    }

    let fullStucture = {}
    let structure = {}

    try {
        structure.earningsDate = (data.earningsDate[0]) ? new Date(data.earningsDate[0]).toISOString().split("T")[0] : "n.a."
        // structure.earningsDate = new Date(data.earningsDate[0]).toISOString().split("T")[0]
        structure.earningsAverage = data.earningsAverage
        structure.earningsLow = data.earningsLow
        structure.earningsHigh = data.earningsHigh
        structure.revenueAverage = data.revenueAverage
        structure.revenueLow = data.revenueLow
        structure.revenueHigh = data.revenueHigh

        Object.assign(fullStucture, structure)
        fullStucture.calendarEventsFullObject = Object.assign({}, structure)

        res.json(fullStucture[service])
    } catch (error) {
        res.json('n.a.')
    }
}


module.exports = calendarEventsController