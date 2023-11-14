
const SoftCoded = require('../Models/SoftCoded')

async function calendarEventsController(req, res) {

    let { ticker, service } = req.query
    console.log(`calendarEvents  ticker = ${ticker} service=${service}`)
    let data = {}

    let calendarEventsInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "calendarEvents" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')


    if (calendarEventsInDB && calendarEventsInDB.date.slice(0, 4) === new Date().toISOString().split('T')[0].slice(0, 4)) {
        console.log('serving from memory')
        console.log(calendarEventsInDB)
        data = JSON.parse(calendarEventsInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=calendarEvents&ssl=true`
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
            data = json.quoteSummary.result[0].calendarEvents.earnings
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
    
    structure.earningsDate = data.earningsDate[0].fmt
    structure.earningsAverage = data.earningsAverage.fmt
    structure.earningsLow = data.earningsLow.raw
    structure.earningsHigh = data.earningsHigh.raw
    
    structure.revenueAverage = data.revenueAverage.raw
    structure.revenueLow = data.revenueLow.raw
    structure.revenueHigh = data.revenueHigh.raw

    Object.assign(fullStucture, structure)

    fullStucture.calendarEventsFullObject = Object.assign({}, structure)

    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])

}


module.exports = calendarEventsController