
const SoftCoded = require('../Models/SoftCoded')

async function assetProfileController(req, res) {

    let { ticker, service } = req.query
    console.log(`AssetProfile  ticker = ${ticker} service=${service}`)
    let data = {}

    let assetProfileInDB = await SoftCoded.findOne({ ticker: ticker, moduleName: "assetProfile" }).select('ticker moduleName moduleName queryResult timeSaved date maxLifeTimeType -_id')


    if (assetProfileInDB && assetProfileInDB.date.slice(0, 4) === new Date().toISOString().split('T')[0].slice(0, 4)) {
        console.log('serving from memory')
        console.log(assetProfileInDB)
        data = JSON.parse(assetProfileInDB.queryResult)
        console.log('data is ###########################')
        console.log(data)
    } else {
        console.log('serving from fetch')
        try {
            url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=assetProfile&ssl=true`
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
            data = json.quoteSummary.result[0].assetProfile
            console.log(data)

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
                SoftCoded.findOneAndUpdate({ ticker: ticker }, {
                    ticker: ticker,
                    queryResult: JSON.stringify(data),
                    moduleName: "assetProfile",
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

    structure.country = data.country
    structure.industry = data.industry
    structure.sector = data.sector
    structure.website = data.website
    structure.longBusinessSummary = data.longBusinessSummary
    structure.fullTimeEmployees = data.fullTimeEmployees    
    Object.assign(fullStucture,structure )
    fullStucture.assetProfileFullObject = Object.assign({}, structure)
    
    console.log('----------------- FULL STRUCTURE -----------------------------')
    console.log(fullStucture)
    console.log('--------------------------------------------------------------')

    res.json(fullStucture[service])





}


module.exports = assetProfileController