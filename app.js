const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const path = require('path')
const yahooFinance = require('yahoo-finance2').default;

const earningsTrendController = require('./Controllers/earningsTrendController')
const recommendationTrendController = require('./Controllers/recommendationTrendController')
const earningsHistoryController = require('./Controllers/earningsHistoryController')
const financialDataController = require('./Controllers/financialDataController')
const calendarEventsController = require('./Controllers/calendarEventsController')
const assetProfileController = require('./Controllers/assetProfileController')
const defaultKeyStatisticsController = require('./Controllers/defaultKeyStatisticsController')
const priceModuleController = require('./Controllers/priceModuleController')
const priceServiceController = require('./Controllers/priceServiceController')
const upgradeDowngradeHistoryController = require('./Controllers/upgradeDowngradeHistoryController')
const summaryDetailController = require('./Controllers/summaryDetailController')

const {
    mongooseConnect
} = require('./Utilities/connectMDB')
mongooseConnect()

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use((req, res, next) => {
    console.log(req.query)
    next()
})


app.get('/upgradeDowngradeHistoryData', upgradeDowngradeHistoryController)
app.post('/earningsTrend', earningsTrendController)
app.post('/recommendationTrend', recommendationTrendController)
app.post('/earningsHistory', earningsHistoryController)
app.post('/financialData', financialDataController)
app.post('/calendarEvents', calendarEventsController)
app.post('/assetProfile', assetProfileController)
app.post('/defaultKeyStatistics', defaultKeyStatisticsController)
app.post('/priceModule', priceModuleController)
app.post('/priceService', priceServiceController)
app.post('/summaryDetail', summaryDetailController)

app.listen(3001, () => {
    console.log('Server started at port 3001')
})    