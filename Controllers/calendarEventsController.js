
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function calendarEventsController(req, res) {

    let { ticker, service } = req.query
    console.log(`calendarEvents  ticker = ${ticker} service=${service}`)
    let data = {}

    let calendarEventsInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "calendarEvents" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    if (calendarEventsInDB && calendarEventsInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        data = JSON.parse(calendarEventsInDB.queryResult)

    } else {
        let sent = false
        console.log('serving from fetch')
        try {
            const results = await yahooFinance.quoteSummary(ticker, { modules: ["calendarEvents"] })
            data = results.calendarEvents.earnings
            console.log(data)
            // --------------------------------------------------------
            if (!calendarEventsInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "calendarEvents",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'thisYear'
                })
                softCoded.save()
            } else {
                console.log('updatingdb')
                console.log(new Date().toISOString().split('T')[0])
                SoftCoded.findOneAndUpdate({ ticker: ticker, moduleName: "calendarEvents" }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "calendarEvents",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'thisYear'
                }).then(data=>console.log(data))
            }
            // --------------------------------------------------------
        } catch (error) {
            console.log(error)
            sent = true
            res.json({
                resp: "n.a."
            })
            return
        }
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