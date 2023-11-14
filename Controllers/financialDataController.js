
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;


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
           
            const results = await yahooFinance.quoteSummary(ticker, { modules: [ "financialData" ] })

            
            data = results.financialData
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


    structure.currentPrice = data.currentPrice
    structure.targetHighPrice = data.targetHighPrice
    structure.targetLowPrice = data.targetLowPrice
    structure.targetMeanPrice = data.targetMeanPrice
    structure.targetMedianPrice = data.targetMedianPrice
    structure.recommendationMean = data.recommendationMean
    structure.recommendationKey = data.recommendationKey
    structure.numberOfAnalystOpinions = data.numberOfAnalystOpinions
    structure.totalCash = data.totalCash
    structure.totalCashPerShare = data.totalCashPerShare
    structure.ebitda = data.ebitda
    structure.totalDebt = data.totalDebt
    structure.totalRevenue = data.totalRevenue
    structure.debtToEquity = data.debtToEquity
    structure.revenuePerShare = data.revenuePerShare
    structure.returnOnAssets = data.returnOnAssets
    structure.returnOnEquity = data.returnOnEquity
    structure.grossProfits = data.grossProfits
    structure.freeCashflow = data.freeCashflow
    structure.operatingCashflow = data.operatingCashflow
    structure.earningsGrowth = data.earningsGrowth
    structure.revenueGrowth = data.revenueGrowth
    structure.grossMargins = data.grossMargins
    structure.ebitdaMargins = data.ebitdaMargins
    structure.operatingMargins = data.operatingMargins
    structure.profitMargins = data.profitMargins
    structure.financialCurrency = data.financialCurrency

    Object.assign(fullStucture, structure)

    fullStucture.financialDataFullObject = Object.assign({}, structure)

    // console.log('----------------- FULL STRUCTURE -----------------------------')
    // console.log(fullStucture)
    // console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])



}


module.exports = financialDataController