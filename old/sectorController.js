const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function sectorController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.sector) {
        console.log('serving from db')
        let sector = instance.sector
        res.json(sector)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=assetProfile&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        if (resp) {
            let sector = resp.assetProfile.sector

            res.json(sector)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.sector) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    sector: sector
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    sector: sector
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

module.exports = sectorController