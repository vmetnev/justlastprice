const HardCoded = require('../Models/HardCoded')
const getData = require('../Services/fetchRequest')

async function industryController(req, res)  {
    let ticker = req.query.ticker
    let instance = await HardCoded.findOne({ ticker: ticker })
     
    if (instance && instance.industry) {
        console.log('serving from db')
        let industry = instance.industry
        res.json(industry)
    } else {
            let url = `https://69.147.92.11/v6/finance/quoteSummary/${ticker}?modules=assetProfile&ssl=true`
            let resp = await getData(url).catch(errorHandler)
            if (resp) {
                let industry = resp.assetProfile.industry

                res.json(industry)

                let instance = await HardCoded.findOne({ ticker: ticker })

                if (instance && !instance.industry) {
                    HardCoded.findOneAndUpdate({
                        ticker: ticker,
                    }, {
                        industry: industry
                    }, {
                        overwrite: true
                    }).then(resp => {
                    })

                } else {
                    let hardCoded = new HardCoded({
                        ticker: ticker,
                        industry: industry
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

module.exports = industryController