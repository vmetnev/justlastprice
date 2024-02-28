const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function financialCurrencyController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.financialCurrency) {
        console.log('serving from db')
        let financialCurrency = instance.financialCurrency
        res.json(financialCurrency)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=financialData&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        
        if (resp) {
            let financialCurrency = resp.financialData.financialCurrency

            res.json(financialCurrency)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.financialCurrency) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    financialCurrency: financialCurrency
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    financialCurrency: financialCurrency
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

module.exports = financialCurrencyController