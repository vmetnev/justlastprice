const yahooFinance = require('yahoo-finance2').default;

async function fundProfileController(req, res) {
    let { ticker, service } = req.query
    console.log(`fundProfile  ticker = ${ticker} service=${service}`)
    let data = {}

    try {
        const results = await yahooFinance.quoteSummary(ticker, { modules: ["fundProfile"] })
        data = results.fundProfile
        console.log(data)
    } catch (error) {
        console.log(error)
        res.json({
            resp: "n.a."
        })
        return
    }
 
    let fullStucture = {}
    let structure = {}

    structure.totalNetAssets = data.feesExpensesInvestment.totalNetAssets
    structure.annualReportExpenseRatio = data.feesExpensesInvestmentCat.annualReportExpenseRatio

    Object.assign(fullStucture, structure)
    fullStucture.assetProfileFullObject = Object.assign({}, structure)

    res.json(fullStucture[service])
}

module.exports = fundProfileController