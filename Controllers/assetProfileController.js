
const SoftCoded = require('../Models/SoftCoded')
const yahooFinance = require('yahoo-finance2').default;

async function assetProfileController(req, res) {

    let { ticker, service } = req.query
    console.log(`AssetProfile  ticker = ${ticker} service=${service}`)
    let data = {}

    let assetProfileInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "assetProfile" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')

    console.log()


    if (assetProfileInDB && assetProfileInDB.date === new Date().toISOString().split('T')[0]) {
        console.log('serving from memory')
        // console.log(assetProfileInDB)
        data = JSON.parse(assetProfileInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {
            const results = await yahooFinance.quoteSummary(ticker, { modules: ["assetProfile"] })
            data = results.assetProfile
            // console.log(data)

            // --------------------------------------------------------
            if (!assetProfileInDB) {
                const softCoded = new SoftCoded({
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "assetProfile",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'thisYear'
                })
                softCoded.save()
            } else {
                console.log("updating db ..........................................")

                let found = await SoftCoded.findOne({ ticker: ticker, moduleName: "assetProfile" })

                console.log(ticker)
                SoftCoded.findOneAndUpdate({ ticker: ticker, moduleName: "assetProfile" }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "assetProfile",
                    timeSaved: new Date().valueOf(),
                    date: new Date().toISOString().split('T')[0],
                    maxLifeTimeType: 'thisYear'
                }).then(data => console.log(data))
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