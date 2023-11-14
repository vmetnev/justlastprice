async function priceServiceController(req, res) {
    console.log(req.query)

    getPriceRange(req.query.ticker).then(data => {

        let lastPrice = data[data.length - 1][1]
        let lastPriceDate = data[data.length - 1][0]
        let lastPriceFullObject = [lastPriceDate, lastPrice]
        let previousDayPrice = data[data.length - 2][1]
        let previousDayDate = data[data.length - 2][0]
        let previousDayFullObject = [previousDayDate, previousDayPrice]

        let today = new Date(new Date(lastPriceDate).toISOString().split('T')[0]).toISOString().split('T')[0]

        console.log('today is ' + today)

        let dateMinus7D = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 7))).toISOString().split('T')[0]).toISOString().split('T')[0]
        let dateMinus1M = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 30))).toISOString().split('T')[0]).toISOString().split('T')[0]
        let dateMinus3M = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 91))).toISOString().split('T')[0]).toISOString().split('T')[0]
        let dateMinus6M = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 182))).toISOString().split('T')[0]).toISOString().split('T')[0]
        let dateMinus12M = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 365))).toISOString().split('T')[0]).toISOString().split('T')[0]
        let dateYTD = `${new Date().getFullYear() - 1}-12-31`
        let datedDate = (req.query.ddate != "") ? new Date(req.query.ddate).toISOString().split('T')[0] : ""

        const { fullObject: dateMinus7DFullObject, date: dateMinus7DDate, price: dateMinus7DPrice } = extractDateAndPrice(dateMinus7D)
        const { fullObject: dateMinus1MFullObject, date: dateMinus1MDate, price: dateMinus1MPrice } = extractDateAndPrice(dateMinus1M)
        const { fullObject: dateMinus3MFullObject, date: dateMinus3MDate, price: dateMinus3MPrice } = extractDateAndPrice(dateMinus3M)
        const { fullObject: dateMinus6MFullObject, date: dateMinus6MDate, price: dateMinus6MPrice } = extractDateAndPrice(dateMinus6M)
        const { fullObject: dateMinus12MFullObject, date: dateMinus12MDate, price: dateMinus12MPrice } = extractDateAndPrice(dateMinus12M)
        const { fullObject: dateYTDFullObject, date: dateYTDDate, price: dateYTDPrice } = extractDateAndPrice(dateYTD)
        const { fullObject: datedPriceFullObject, date: datedPriceDate, price: datedPricePrice } = (req.query.ddate != "") ? extractDateAndPrice(datedDate) : {}
        const [low52FullObject, low52Date, low52Price, high52FullObject, high52Date, high52Price] = weeks52(data)

        let perf1D = ((lastPrice / previousDayPrice - 1) * 100).toFixed(2) + "%"
        let perf1W = ((lastPrice / dateMinus7DPrice - 1) * 100).toFixed(2) + "%"
        let perf1M = ((lastPrice / dateMinus1MPrice - 1) * 100).toFixed(2) + "%"
        let perf3M = ((lastPrice / dateMinus3MPrice - 1) * 100).toFixed(2) + "%"
        let perf6M = ((lastPrice / dateMinus6MPrice - 1) * 100).toFixed(2) + "%"
        let perf12M = ((lastPrice / dateMinus12MPrice - 1) * 100).toFixed(2) + "%"
        let perfYTD = ((lastPrice / dateYTDPrice - 1) * 100).toFixed(2) + "%"

        let priceObject = {
            ['dateMinus7DFullObject']: dateMinus7DFullObject,
            ['dateMinus7DDate']: dateMinus7DDate,
            ['dateMinus7DPrice']: dateMinus7DPrice,
            ['dateMinus1MFullObject']: dateMinus1MFullObject,
            ['dateMinus1MDate']: dateMinus1MDate,
            ['dateMinus1MPrice']: dateMinus1MPrice,
            ['dateMinus3MFullObject']: dateMinus3MFullObject,
            ['dateMinus3MDate']: dateMinus3MDate,
            ['dateMinus3MPrice']: dateMinus3MPrice,
            ['dateMinus6MFullObject']: dateMinus6MFullObject,
            ['dateMinus6MDate']: dateMinus6MDate,
            ['dateMinus6MPrice']: dateMinus6MPrice,
            ['dateMinus12MFullObject']: dateMinus12MFullObject,
            ['dateMinus12MDate']: dateMinus12MDate,
            ['dateMinus12MPrice']: dateMinus12MPrice,
            ['dateYTDFullObject']: dateYTDFullObject,
            ['dateYTDDate']: dateYTDDate,
            ['dateYTDPrice']: dateYTDPrice,
            ['lastPriceFullObject']: lastPriceFullObject,
            ['lastPriceDate']: lastPriceDate,
            ['lastPrice']: lastPrice,
            ['previousDayFullObject']: previousDayFullObject,
            ['previousDayPrice']: previousDayPrice,
            ['previousDayDate']: previousDayDate,
            ['perf1D']: perf1D,
            ['perf1W']: perf1W,
            ['perf1M']: perf1M,
            ['perf3M']: perf3M,
            ['perf6M']: perf6M,
            ['perf12M']: perf12M,
            ['perfYTD']: perfYTD,
            ['datedPriceFullObject']: datedPriceFullObject,
            ['datedPriceDate']: datedPriceDate,
            ['datedPricePrice']: datedPricePrice,
            ['low52FullObject']: low52FullObject,
            ['low52Date']: low52Date,
            ['low52Price']: low52Price,
            ['high52FullObject']: high52FullObject,
            ['high52Date']: high52Date,
            ['high52Price']: high52Price,
        }


        priceObject.priceServiceFullObject = Object.assign({}, priceObject)

        console.log('----------------------')
        console.log(req.query.service)
        console.log(priceObject[req.query.service])
        console.log(priceObject)
        console.log(priceObject[req.query.service])

        if (!priceObject[req.query.service]) {
            res.json("n.a. service name")
        } else {

            res.json(priceObject[req.query.service])
        }


        // --------------------------------------------------------------------------------------------------------------------------
        function extractDateAndPrice(target) {

            counter = data.length
            target = target
            do {
                counter--
                if (data[counter][0] === target || new Date(data[counter][0]).valueOf() < new Date(target).valueOf()) break
            } while (counter > -1)

            return {
                fullObject: data[counter],
                date: data[counter][0],
                price: data[counter][1]
            }
        }
    }).catch(error => {
        console.log('error')
        console.log(error)
        res.json({ error: error })
    })

    function weeks52(data) {
        let lowObj = {}
        let highObj = {}

        lowObj.date = data[0][0]
        lowObj.price = data[0][1]
        highObj.date = data[0][0]
        highObj.price = data[0][1]


        for (let q = 0; q < data.length - 1; q++) {
            if (data[q][1] < lowObj.price) {
                lowObj.date = data[q][0]
                lowObj.price = data[q][1]
            }
            if (data[q][1] > highObj.price) {
                highObj.date = data[q][0]
                highObj.price = data[q][1]
            }
        }

        return [
            lowObj,
            lowObj.date,
            lowObj.price,
            highObj,
            highObj.date,
            highObj.price,
        ]
    }
}

async function getPriceRange(ticker) {// just returns one year price range
    return new Promise(async (resolve, reject) => {

        let today = new Date(new Date().toISOString().split('T')[0])
        let todayShortValue = Math.round(new Date().valueOf() / 1000, 0)
        let dateMinus12MShortValue = new Date((new Date(new Date(today).setDate(new Date(today).getDate() - 400))).toISOString().split('T')[0]) / 1000

        try {
            let url = `https://69.147.92.11/v7/finance/download/${ticker}?period1=${dateMinus12MShortValue}&period2=${todayShortValue}&interval=1d&events=history&includeAdjustedClose=true&ssl=true`

            let response = await fetch(url, {
                headers: {
                    'Host': 'query2.finance.yahoo.com'
                }
            });

            if (response.statusText === "OK") {
                let data = await response.text()
                data = data.split(String.fromCharCode(10))
                let output = []
                for (let q = data.length - 10; q < data.length; q++) {
                    console.log(data[q])
                }

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

module.exports = priceServiceController