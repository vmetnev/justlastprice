const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    console.log(req.ip)
    fs.appendFile(path.join(__dirname, './public/log.txt'), `Access: ${new Date()} - ${req.ip}\n`, function (error) {
        if (error) console.log(error)
    })
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/logvmetnev', (req, res) => {
    res.sendFile(path.join(__dirname, './public/log.txt'))
})

app.post('/lastprice', async (req, res) => {
    let ticker = undefined
    console.log(req.query)

    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker

    fs.appendFile(path.join(__dirname, './public/log.txt'), `Ticker - ${ticker} Access: ${new Date()} - ${req.ip}\n`, function (error) {
        if (error) console.log(error)
    })

    getLastPrice(ticker).then(data => {
        console.log(data)
        res.json(data)
    })
})


app.post('/earningsDate', async (req, res) => {
    let ticker = undefined
    console.log(req.query)
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    let url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=calendarEvents`
    const response = await fetch(url)
    const json = await response.json()

    try {
        const earnings = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate // can generate mistakes
        let rest = ""
        if (earnings != null && earnings.length > 1) resp = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[0].fmt + " / " + json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[1].fmt
        if (earnings != null && earnings.length === 1) resp = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[0].fmt
        res.json(resp)
    } catch (error) {
        res.json('n.a.')
    }

})

app.post('/datedPrice', async (req, res) => {
    console.log(req.query)
    let ticker = undefined
    let ddate = undefined
    if ('ticker' in req.query && req.query.ticker.length > 0) ticker = req.query.ticker
    if ('ticker' in req.query && req.query.ddate.length > 0) ddate = req.query.ddate
    ddate = ddate.split('.')
    ddate = `${ddate[2]}-${ddate[1]}-${ddate[0]}`

    let datePlusOne = (new Date(new Date(ddate).setDate(new Date(ddate).getDate() + 1))).valueOf() / 1000
    let dateminusFive = new Date(new Date(ddate).setDate(new Date(ddate).getDate() - 5)).valueOf() / 1000

    fs.appendFile(path.join(__dirname, './public/log.txt'), `Ticker - ${ticker} ${new Date(datePlusOne*1000)} ${new Date(dateminusFive*1000)} Access: ${new Date()} - ${req.ip}\n`, function (error) {
        if (error) console.log(error)
    })

    getDatedPrice(ticker, dateminusFive, datePlusOne).then(data => {
        data = data[data.length - 1].split(',')[4]
        res.json(parseFloat(data))
    })
})

app.post('/priceForPeriod', async (req, res) => {})

function getLastPrice(ticker) {
    return new Promise(async (resolve, reject) => {
        const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`

        try {
            const response = await fetch(url)
            const json = await response.json()
            const data = json.quoteSummary.result[0].price.regularMarketPrice.raw
            resolve(data)
        } catch (error) {
            resolve(0)
        }
    })
}

function getDatedPrice(ticker, dateminusFive, datePlusOne) {
    return new Promise((resolve, reject) => {
        let url = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${dateminusFive}&period2=${datePlusOne}&interval=1d&events=history&includeAdjustedClose=true`

        fetch(url, {}).then(data => {
            data.text().then(data => {
                data = data.split(String.fromCharCode(10))
                console.log(data)
                resolve(data)
            })
        })
    })




}

function getPriceForPeriod(ticker, startDdateString, lastDdateString) {

}

app.listen(3001, () => {
    console.log('Server started at port 3001')
})