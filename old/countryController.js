const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function countryController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.country) {
        console.log('serving from db')
        let country = instance.country
        res.json(country)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=assetProfile&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        if (resp) {
            let country = resp.assetProfile.country

            res.json(country)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.country) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    country: country
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    country: country
                })
                hardCoded.save()
            }
        }
        function errorHandler(error) {
            console.log('error is: ' + error)
            res.json(error)
        }

    }
}

module.exports = countryController