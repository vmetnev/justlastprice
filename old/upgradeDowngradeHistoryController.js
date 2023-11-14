

async function upgradeDowngradeHistoryController(req, res) {
    console.log(req.query)
    ticker = req.query.ticker

    try {

        url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=upgradeDowngradeHistory&ssl=true`
        console.log(url)
        let response = await fetch(url, {
            headers: {
                'Host': 'query2.finance.yahoo.com'
            }
        });
        const json = await response.json()


        const data = json.quoteSummary.result[0]
        console.log(data)

        let upgradeDowngradeHistory = data.upgradeDowngradeHistory.history
        console.log(upgradeDowngradeHistory)
        if (data == 0) reject('no data')
        res.json(upgradeDowngradeHistory)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }

}


module.exports = upgradeDowngradeHistoryController