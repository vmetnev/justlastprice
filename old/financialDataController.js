
const SoftCoded = require('../Models/SoftCoded')


async function financialDataController(req, res) {

    let { ticker, service } = req.query
    console.log(`financialData  ticker = ${ticker} service=${service}`)
    let data = {}

    let financialDataInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "financialData" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')


    if (financialDataInDB && financialDataInDB.date.slice(0, 4) === new Date().toISOString().split('T')[0].slice(0, 4)) {
        console.log('serving from memory')
        console.log(financialDataInDB)
        data = JSON.parse(financialDataInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=financialData&ssl=true`
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
            data = json.quoteSummary.result[0].financialData
            console.log(data)

            // --------------------------------------------------------
            if (!financialDataInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "financialData",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'thisYear'
                })
                softCoded.save()
            } else {
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "financialData",
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


    structure.currentPrice = data.currentPrice.fmt
    structure.targetHighPrice = data.targetHighPrice.fmt
    structure.targetLowPrice = data.targetLowPrice.fmt
    structure.targetMeanPrice = data.targetMeanPrice.fmt
    structure.targetMedianPrice = data.targetMedianPrice.fmt
    structure.recommendationMean = data.recommendationMean.fmt
    structure.recommendationKey = data.recommendationKey
    structure.numberOfAnalystOpinions = data.numberOfAnalystOpinions.raw
    structure.totalCash = data.totalCash.raw
    structure.totalCashPerShare = data.totalCashPerShare.fmt
    structure.ebitda = data.ebitda.raw
    structure.totalDebt = data.totalDebt.raw
    structure.totalRevenue = data.totalRevenue.raw
    structure.debtToEquity = data.debtToEquity.fmt
    structure.revenuePerShare = data.revenuePerShare.raw
    structure.returnOnAssets = data.returnOnAssets.fmt
    structure.returnOnEquity = data.returnOnEquity.fmt
    structure.grossProfits = data.grossProfits.raw
    structure.freeCashflow = data.freeCashflow.raw
    structure.operatingCashflow = data.operatingCashflow.raw
    structure.earningsGrowth = data.earningsGrowth.fmt
    structure.revenueGrowth = data.revenueGrowth.fmt
    structure.grossMargins = data.grossMargins.fmt
    structure.ebitdaMargins = data.ebitdaMargins.fmt
    structure.operatingMargins = data.operatingMargins.fmt
    structure.profitMargins = data.profitMargins.fmt
    structure.financialCurrency = data.financialCurrency

    Object.assign(fullStucture, structure)

    fullStucture.financialDataFullObject = Object.assign({}, structure)

    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])



}


module.exports = financialDataController