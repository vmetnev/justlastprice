const yahooFinance = require('yahoo-finance2').default;

async function chartDataController2(req, res) {
    console.log(req.query)
    const { ticker, service } = req.query

    getPriceRange(ticker).then(data => {
        res.json(data[service])
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
            console.log('here')
            let url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${dateMinus5YShortValue}&period2=${todayShortValue}&interval=1d&events=history&includeAdjustedClose=true`

            let response = await fetch(url, {}).catch(error=>{
                console.log(error)
                res.json(error)
                return
            }); 
            console.log(response.statusText)

            if (response.statusText === "OK") {
                let data = await response.text()
                data = data.split(String.fromCharCode(10))
                let output = []
                let min = data[1].split(',')[4] * 1
                let max = data[1].split(',')[4] * 1
              console.log(data.length)
                for (let q = 1; q < data.length; q++) {
                    let day = []
                    day.push(data[q].split(',')[0])
                    day.push(data[q].split(',')[4])
                    output.push(day)

                    min = (min > data[q].split(',')[4] * 1) ? min = data[q].split(',')[4] * 1 : min = min
                    max = (max < data[q].split(',')[4] * 1) ? max = data[q].split(',')[4] * 1 : max = max
                }

                firstDate = data[1].split(',')[0]


                console.log('min ' + min)
                console.log('max ' + max)

                resolve({
                    data: output,
                    fiveYearMin: min,
                    fiveYearMax: max,
                    firstDate: firstDate

                })
            } else {
                throw new Error(`failed fetch - ${response.statusText}`)
            }
        } catch (error) {
            reject(`failed fetch - ${error}`)
        }
    })
}

module.exports = chartDataController2