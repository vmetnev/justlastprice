

const yahooFinance = require('yahoo-finance2').default;

async function chartDataController(req, res) {
    getPriceRange(req.query.ticker).then(data => {
        res.json(data)
    }).catch(error => {
        res.json(error)
    })
}

async function getPriceRange(ticker) {
    return new Promise(async (resolve, reject) => {

        let today = new Date(new Date().toISOString().split('T')[0])
        let todayShortValue = Math.round(new Date().valueOf() / 1000, 0)
        let dateMinus5YShortValue = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 366 * 5))).toISOString().split('T')[0]) / 1000

        try {
            console.log(ticker)
            let url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${dateMinus5YShortValue}&period2=${todayShortValue}&interval=1d&events=history&includeAdjustedClose=true`

            let response = await fetch(url, {});

            if (response.statusText === "OK") {
                let data = await response.text()
                data = data.split(String.fromCharCode(10))
                let output = []


                for (let q = 1; q < data.length; q++) {
                    let day = []
                    day.push(data[q].split(',')[0])
                    day.push(data[q].split(',')[4])
                    output.push(day)
                }
                resolve(output)
            } else {
                throw new Error(`failed fetch - ${response.statusText}`)
            }
        } catch (error) {
            reject(`failed fetch - ${error}`)
        }
    })
}

module.exports = chartDataController