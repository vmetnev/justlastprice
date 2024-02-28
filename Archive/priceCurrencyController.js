const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function priceCurrencyController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.priceCurrency) {
        console.log('serving from db')
        let priceCurrency = instance.priceCurrency
        res.json(priceCurrency)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=price&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        if (resp) {
            let priceCurrency = resp.price.currency

            res.json(priceCurrency)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.priceCurrency) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    priceCurrency: priceCurrency
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    priceCurrency: priceCurrency
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

module.exports = priceCurrencyController