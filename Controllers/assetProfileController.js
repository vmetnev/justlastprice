const yahooFinance = require('yahoo-finance2').default;

async function assetProfileController(req, res) {

    let { ticker, service } = req.query
    console.log(`AssetProfile  ticker = ${ticker} service=${service}`)
    let data = {}

    try {
        const results = await yahooFinance.quoteSummary(ticker, { modules: ["assetProfile"] })
        data = results.assetProfile
    } catch (error) {
        console.log(error)
        res.json({
            resp: "n.a."
        })
    }

    let fullStucture = {}
    let structure = {}

    structure.country = data.country
    structure.industry = data.industry
    structure.sector = data.sector
    structure.website = data.website
    structure.longBusinessSummary = data.longBusinessSummary
    structure.fullTimeEmployees = data.fullTimeEmployees
    Object.assign(fullStucture, structure)
    fullStucture.assetProfileFullObject = Object.assign({}, structure)

    // console.log('----------------- FULL STRUCTURE -----------------------------')
    // // console.log(fullStucture)
    // console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])
}

module.exports = assetProfileController