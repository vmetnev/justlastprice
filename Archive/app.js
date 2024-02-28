const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')



const industryController = require('./old/industryController')
const sectorController = require('./old/sectorController')
const nameController = require('./old/nameController')
const descriptionController = require('./old/descriptionController')
const countryController = require('./old/countryController')
const siteController = require('./old/siteController')
const priceCurrencyController = require('./old/priceCurrencyController')
const financialCurrencyController = require('./old/financialCurrencyController')

const earningsTrend = require('./Controllers/earningsTrend')
const recommendationTrend = require('./Controllers/recommendationTrend')

const earningsHistoryController = require('./Controllers/earningsHistoryController')
const financialDataController = require('./Controllers/financialDataController')
const calendarEventsController = require('./Controllers/calendarEventsController')
const assetProfileController = require('./Controllers/assetProfileController')
const defaultKeyStatisticsController = require('./Controllers/defaultKeyStatisticsController')
const priceModuleController = require('./Controllers/priceModuleController')
const priceServiceController = require('./Controllers/priceServiceController')



const mongoose = require("mongoose");
const {

    mongooseConnect
} = require('./Utilities/connectMDB')
mongooseConnect()

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

// Connecting models
// const datedPrice = require('./Models/datedPrice')
// const logModel = require('./Models/LogModel')

//Connecting controllers


let lastCall = 0
let nextCall = 0

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(cors(corsOptions))
// app.use(logit)

let memory = {}
let output = []

// datedPrice.find().then(data => {
//     output = data
//     for (q = 0; q < output.length; q++) {

//         if (memory[output[q].ticker]) {

//             memory[output[q].ticker][output[q].ddate] = output[q].price
//         } else {
//             memory[output[q].ticker] = {}
//             memory[output[q].ticker][output[q].ddate] = output[q].price
//         }
//     }
// })




app.post('/lastprice', async (req, res) => {

    if (lastCall === 0) lastCall = new Date().valueOf()

    nextCall = lastCall + 300
    lastCall = nextCall
    setTimeout(() => {
        let ticker = undefined
        console.log(req.query)

        if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker

        getLastPrice(ticker).then(data => {

            console.log(data)
            res.json(data)
        })
    }, nextCall - new Date().valueOf())

})

app.post('/marketcap', async (req, res) => {

    console.log(`last call ${lastCall}  next call ${nextCall}`)

    setTimeout(async () => {

        lastCall = new Date().valueOf()
        nextCall = lastCall + 300

        let ticker = undefined
        console.log(req.query)
        if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
        try {
            const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=price`
            const response = await fetch(url)
            console.log(response.statusText)
            const json = await response.json()
            const data = json.quoteSummary.result[0]
            let mcToReturn = data.price.marketCap.raw
            if (data == 0) reject('no data')
            res.json(mcToReturn)
        } catch (error) {
            res.json({
                resp: "n.a."
            })
        }
    }, nextCall - new Date().valueOf())



})

app.post('/name', async (req, res) => {
    setTimeout(async () => {
        console.log('name service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        nameController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/industry', async (req, res) => {
    setTimeout(async () => {
        console.log('Industry service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        industryController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/sector', async (req, res) => {
    setTimeout(async () => {
        console.log('Sector service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        sectorController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/description', async (req, res) => {
    setTimeout(async () => {
        console.log('Description service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        descriptionController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/country', async (req, res) => {
    setTimeout(async () => {
        console.log('country service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        countryController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/priceCurrency', async (req, res) => {
    setTimeout(async () => {
        console.log('priceCurrency service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        priceCurrencyController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/site', async (req, res) => {
    setTimeout(async () => {
        console.log('site service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        siteController(req, res)
    }, nextCall - new Date().valueOf())
})

app.post('/financialCurrency', async (req, res) => {
    setTimeout(async () => {
        console.log('financialCurrency service')
        console.log(req.query)
        lastCall = new Date().valueOf()
        nextCall = lastCall + 500
        financialCurrencyController(req, res)
    }, nextCall - new Date().valueOf())
})


app.post('/targetMedianPrice', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=financialData`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]


        let targetMedianPrice = data.financialData.targetMedianPrice.fmt
        console.log(targetMedianPrice)
        if (data == 0 || targetMedianPrice === undefined) reject('no data')
        res.json(targetMedianPrice)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/recommendationKey', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=financialData`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]


        let recommendationKey = data.financialData.recommendationKey
        console.log(recommendationKey)
        if (data == 0 || recommendationKey === undefined) reject('no data')
        res.json(recommendationKey)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/numberOfAnalystOpinions', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=financialData`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]


        let numberOfAnalystOpinions = data.financialData.numberOfAnalystOpinions.fmt
        console.log(numberOfAnalystOpinions)
        if (data == 0 || numberOfAnalystOpinions === undefined) reject('no data')
        res.json(numberOfAnalystOpinions)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/forwardPE', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`
        const response = await fetch(url)
        const json = await response.json()
        console.log('here')
        const data = json.quoteSummary.result[0]


        let forwardPE = data.defaultKeyStatistics.forwardPE.fmt
        console.log(forwardPE)
        if (data == 0 || forwardPE === undefined) reject('no data')
        res.json(forwardPE)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/trailingPE', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=summaryDetail`
        const response = await fetch(url)
        const json = await response.json()
        console.log('here')
        const data = json.quoteSummary.result[0]


        let trailingPE = data.summaryDetail.trailingPE.fmt
        console.log(trailingPE)
        if (data == 0 || trailingPE === undefined) reject('no data')
        res.json(trailingPE)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/dividendYield', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=summaryDetail`
        const response = await fetch(url)
        const json = await response.json()
        console.log('here')
        const data = json.quoteSummary.result[0]


        let dividendYield = data.summaryDetail.dividendYield.fmt
        console.log(trailingPE)
        if (data == 0 || dividendYield === undefined) reject('no data')
        res.json(dividendYield)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/enterpriseValue', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]


        let enterpriseValue = data.defaultKeyStatistics.enterpriseValue.raw
        console.log(enterpriseValue)
        if (data == 0 || enterpriseValue === undefined) reject('no data')
        res.json(enterpriseValue)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/evToSales', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]

        let evToSales = data.defaultKeyStatistics.enterpriseToRevenue.fmt
        console.log(evToSales)
        if (data == 0 || evToSales === undefined) reject('no data')
        res.json(evToSales)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/evToEBITDA', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]

        let evToEBITDA = data.defaultKeyStatistics.enterpriseToEbitda.fmt
        console.log(evToEBITDA)
        if (data == 0 || evToEBITDA === undefined) reject('no data')
        res.json(evToEBITDA)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/beta', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]

        let beta = data.defaultKeyStatistics.beta.fmt
        console.log(beta)
        if (data == 0 || beta === undefined) reject('no data')
        res.json(beta)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/revenue', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=financialData`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]

        let revenue = data.financialData.totalRevenue.raw
        console.log(revenue)
        if (data == 0 || revenue === undefined) reject('no data')
        res.json(revenue)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/ebitda', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=financialData`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]

        let ebitda = data.financialData.ebitda.raw
        console.log(ebitda)
        if (data == 0 || ebitda === undefined) reject('no data')
        res.json(ebitda)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

app.post('/freeCashFlow', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    try {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=financialData`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]

        let freeCashFlow = data.financialData.freeCashflow.raw
        console.log(freeCashFlow)
        if (data == 0 || freeCashFlow === undefined) reject('no data')
        res.json(freeCashFlow)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }
})

// ----------------------------------------------------------------------
app.post('/price', async (req, res) => {
    console.log(req.query)

    setTimeout(async () => {
        lastCall = new Date().valueOf()
        nextCall = lastCall + 400

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

            console.log('----------------------')
            console.log(req.query.service)
            console.log(priceObject[req.query.service])
            console.log(priceObject)
            console.log(priceObject[req.query.service])
            res.json(priceObject[req.query.service])

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
    }, nextCall - new Date().valueOf())
})

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



// ----------------------------------------------------------------------







app.post('/earningsDate', async (req, res) => {
    console.log('earnings Date')
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    let url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=calendarEvents`
    const response = await fetch(url)
    console.log(response.statusText)
    if (response.statusText != "OK") {
        res.json("error on fetch")
    } else {
        const json = await response.json()

        try {
            const earnings = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate // can generate mistakes
            let resp = ""
            if (earnings != null && earnings.length > 1) resp = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[0].fmt + " / " + json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[1].fmt
            if (earnings != null && earnings.length === 1) resp = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[0].fmt

            if (resp != "") {
                res.json(resp)
            } else {
                res.json("n.a. date")
            }

        } catch (error) {
            console.log(error)
            res.json('n.a.')
        }
    }
})

app.get('/upgradeDowngradeHistoryData', async (req, res) => {
    console.log(req.query)
    ticker = req.query.ticker

    try {

        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=upgradeDowngradeHistory`
        const response = await fetch(url)
        const json = await response.json()

        const data = json.quoteSummary.result[0]


        let upgradeDowngradeHistory = data.upgradeDowngradeHistory.history
        console.log(upgradeDowngradeHistory)
        if (data == 0) reject('no data')
        res.json(upgradeDowngradeHistory)
    } catch (error) {
        res.json({
            resp: "n.a."
        })
    }

})


// app.post('/datedPrice', datedPriceController)
app.post('/priceAsOfDate', datedPriceController)
app.post('/previousDayPrice', previousDayPriceController)
app.post('/earningsTrend', earningsTrend)
app.post('/recommendationTrend', recommendationTrend)
app.post('/earningsHistory',earningsHistoryController)

app.post('/financialData',financialDataController)
app.post('/calendarEvents',calendarEventsController)
app.post('/assetProfile',assetProfileController)
app.post('/defaultKeyStatistics',defaultKeyStatisticsController)
app.post('/priceModule',priceModuleController)

app.post('/priceService',priceServiceController)






async function previousDayPriceController(req, res) {
    console.log(req.query)
    let ticker = undefined
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker

    let today = Math.round((new Date().valueOf()) / 1000, 0)
    let dateminusFive = Math.round(new Date(new Date().setDate(new Date().getDate() - 5)).valueOf() / 1000, 0)

    getPriceRange(ticker, dateminusFive, today).then(data => {
        console.log(data[0].indexOf('Not Found'))

        if (data[0].indexOf('Not Found') != 4) {
            let price = parseFloat(data[data.length - 2].split(',')[4], 2)
            res.json(price)
            console.log(price)
        } else {
            res.json(0)
        }
    })
}

async function datedPriceController(req, res) {
    console.log('datedPriceController')
    console.log(req.query)
    let ticker = undefined
    let ddate = undefined

    res.json({ message: 0 })
    return

    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    if ('ddate' in req.query && req.query.ddate.length > 0) ddate = req.query.ddate
    if (ddate === '' || ddate === undefined || ddate === NaN) {
        res.json(0)
        return
    }

    dateArr = ddate.split('.')
    dateArr = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0]
    console.log(dateArr)

    if (ticker && ticker in memory) console.log('ticker in memory')
    if (memory[ticker] && dateArr in memory[ticker]) console.log('ddate in ticker')

    if (ticker in memory && dateArr in memory[ticker]) {
        res.json(memory[ticker][dateArr])
        console.log('served from memory')
    } else {
        try {
            ddate = ddate.split('.')
            ddate = `${ddate[2]}-${ddate[1]}-${ddate[0]}`


            let datePlusOne = (new Date(new Date(ddate).setDate(new Date(ddate).getDate() + 1))).valueOf() / 1000
            console.log('---------------------')
            console.log('datePlusOne')
            console.log(datePlusOne)
            console.log('---------------------')
            let dateminusFive = new Date(new Date(ddate).setDate(new Date(ddate).getDate() - 5)).valueOf() / 1000

            getPriceRange(ticker, dateminusFive, datePlusOne).then(data => {

                console.log('---------------------')
                console.log('dateminusFive')
                console.log(dateminusFive)
                console.log(new Date(dateminusFive))
                console.log('---------------------')
                console.log(data[data.length - 1])
                data = data[data.length - 1].split(',')[4]
                data = parseFloat(data)
                data = data.toFixed(2)
                data = parseFloat(data)


                if (ticker in memory) {
                    memory[ticker][ddate] = data
                } else {
                    memory[ticker] = {}
                    memory[ticker][ddate] = data
                }
                res.json(data)
                console.log('served from fetch')
                console.log(ticker)
                console.log(typeof data)
                console.log(data)

                if (!isNaN(data)) {

                    let price = new datedPrice({
                        ticker: ticker,
                        ddate: ddate,
                        price: (data === NaN || data === undefined) ? 0 : data

                    })

                    try {
                        price.save().then(data => {
                            // console.log(data)
                        })
                    } catch (error) {

                    }




                } else {

                    try {
                        let price = new datedPrice({
                            ticker: ticker,
                            ddate: ddate,
                            price: 0

                        })
                    } catch (error) {

                    }


                    try {
                        price.save().then(data => {
                        })
                    } catch (error) {
                        console.log('there was some error')
                    }



                }
            })

        } catch (error) {
            res.send("n.a")
        }
    }
}

function getLastPrice(ticker) {
    return new Promise(async (resolve, reject) => {
        const url = `https://query1.finance.yahoo.com/v6/finance/quoteSummary/${ticker}?modules=price`

        try {

            let headers = new Headers({
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            });

            const response = await fetch(url, {
                method: 'GET',
                headers: headers

            })
            const json = await response.json()
            console.log(json)
            const data = json.quoteSummary.result[0].price.regularMarketPrice.raw
            resolve(data)
        } catch (error) {
            resolve(0)
        }
    })
}

// function getPriceRange(ticker, startDate, lastDate) {

//     console.log(startDate)
//     console.log(lastDate)

//     return new Promise((resolve, reject) => {
//         let url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${startDate}&period2=${lastDate}&interval=1d&events=history&includeAdjustedClose=true`

//         try {
//             fetch(url, {}).then(data => {
//                 data.text().then(data => {
//                     data = data.split(String.fromCharCode(10))
//                     resolve(data)
//                 })
//             })
//         } catch (error) {
//             if (error) resolve(error)
//         }
//     })
// }

// function logit(req, res, next) {
//     let logInstance = new logModel({
//         dateAndTime: (new Date().valueOf()),
//         logSource: 'justlastprice',
//         baseurl: req.baseurl ? req.baseurl.toString() : "",
//         body: req.body ? JSON.stringify(req.body) : "",
//         cookies: req.cookies ? req.cookies.toString() : "",
//         fresh: req.fresh ? req.fresh.toString() : "",
//         hostname: req.hostname ? req.hostname.toString() : "",
//         ip: req.ip ? req.ip.toString() : "",
//         ips: req.ips ? req.ips.toString() : "",
//         originalurl: req.originalurl ? req.originalurl.toString() : "",
//         params: req.params ? JSON.stringify(req.params) : "",
//         path: req.path ? req.path.toString() : "",
//         protocol: req.protocol ? req.protocol.toString() : "",
//         query: req.query ? JSON.stringify(req.query) : "",
//         route: req.route ? req.route.toString() : "",
//     })

//     // logInstance.save().then(data => data = data)
//     next()
// }

app.listen(3001, () => {
    console.log('Server started at port 3001')
})    