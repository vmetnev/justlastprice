
const yahooFinance = require('yahoo-finance2').default;

async function financialDataController(req, res) {

    let { ticker, service } = req.query
    console.log(`financialData  ticker = ${ticker} service=${service}`)
    let data = {}
            try { 
            const results = await yahooFinance.quoteSummary(ticker, { modules: ["financialData"] })
            data = results.financialData
            console.log(data)          
        } catch (error) {
            console.log(error)
            res.json({
                resp: "n.a."
            })        
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