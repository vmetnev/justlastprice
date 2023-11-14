const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function nameController(req, res) {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })

    if (instance && instance.name) {
        console.log('serving from db')
        let name = instance.name
        res.json(name)
    } else {
        let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=price&ssl=true`
        let resp = await getData(url).catch(errorHandler)
        if (resp) {
            let name = resp.price.longName

            res.json(name)

            let instance = await HardCoded.findOne({ ticker: ticker })

            if (instance && !instance.name) {
                HardCoded.findOneAndUpdate({
                    ticker: ticker,
                }, {
                    name: name
                }, {
                    overwrite: true
                }).then(resp => {
                })

            } else {
                let hardCoded = new HardCoded({
                    ticker: ticker,
                    name: name
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

module.exports = nameController