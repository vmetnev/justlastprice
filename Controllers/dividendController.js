const yahooFinance = require('yahoo-finance2').default;

async function dividendController(req, res) {
    console.log('here')
    console.log(req.query)
    let { ticker, startDate, endDate } = req.query
    console.log(`dividendController  ticker = ${ticker} startDate=${startDate} endDate=${endDate}`)
    let data = {}

    try {
        const query = ticker
        const queryOptions = { period1: startDate, period2: endDate, return: "object", /* ... */ }
        const result = await yahooFinance.chart(query, queryOptions)
        
        // .catch(error => {
        //     console.log('caught error')
        //     res.json(error)
        //     return
        // });
        console.log(result)
        if (result && result.events) {
            let dividend = 0
            for (key in result.events.dividends) {
                dividend += result.events.dividends[key].amount
                console.log(result.events.dividends[key])
            }
            console.log(dividend)
            res.json(dividend)

        } else {
            console.log('no dividends found')
            res.json(0)
        }

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


}


module.exports = dividendController