
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function calendarEventsController(req, res) {

    let { ticker, service } = req.query
    console.log(`calendarEvents  ticker = ${ticker} service=${service}`)
    let data = {}

    let calendarEventsInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "calendarEvents" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')


    if (calendarEventsInDB && calendarEventsInDB.date.slice(0, 4) === new Date().toISOString().split('T')[0].slice(0, 4)) {
        console.log('serving from memory')    
        data = JSON.parse(calendarEventsInDB.queryResult)
    
    } else {
        console.log('serving from fetch')
        try {
            const results = await yahooFinance.quoteSummary(ticker, { modules: [ "calendarEvents" ] })
            data = results.calendarEvents.earnings            

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
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "calendarEvents",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'thisYear'
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
    
    structure.earningsDate = new Date(data.earningsDate[0]).toISOString().split("T")[0]
    structure.earningsAverage = data.earningsAverage
    structure.earningsLow = data.earningsLow
    structure.earningsHigh = data.earningsHigh    
    structure.revenueAverage = data.revenueAverage
    structure.revenueLow = data.revenueLow
    structure.revenueHigh = data.revenueHigh

    Object.assign(fullStucture, structure)
    fullStucture.calendarEventsFullObject = Object.assign({}, structure)
    res.json(fullStucture[service])

}


module.exports = calendarEventsController