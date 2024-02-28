const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function siteController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.site) {
        console.log('serving from db')
        let site = instance.site
        res.json(site)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=assetProfile&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        
        if (resp) {
            let site = resp.assetProfile.website

            res.json(site)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.site) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    site: site
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    site: site
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

module.exports = siteController