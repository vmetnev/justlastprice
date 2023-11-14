const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function descriptionController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.description) {
        console.log('serving from db')
        let description = instance.description
        res.json(description)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=assetProfile&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        if (resp) {
            let description = resp.assetProfile.longBusinessSummary

            res.json(description)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.description) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    description: description
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    description: description
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

module.exports = descriptionController