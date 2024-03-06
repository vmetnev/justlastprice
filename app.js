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
const chartDataController = require('./Controllers/chartDataController')
const fundProfileController = require('./Controllers/fundProfileController')
const dividendController = require('./Controllers/dividendController')

const getNewsController = require('./Controllers/getNewsController')
const saveNewsController = require('./Controllers/saveNewsController')
const getTagsController = require('./Controllers/getTagsController')
const addTagController = require('./Controllers/addTagController')
const deleteTagController = require('./Controllers/deleteTagController')


const chartDataController2 = require('./Controllers/chartDataController2')
const reportsController = require('./Controllers/reportsController')

const {
    mongooseConnect
} = require('./Utilities/connectMDB')
mongooseConnect()

const cors = require("cors");
const getNewsContoller = require('./Controllers/getNewsController');
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html']
}))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(cors(corsOptions))

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
app.post('/chartData', chartDataController)
app.post('/fundProfile', fundProfileController)
app.post('/dividend', dividendController)
app.post('/fiveYearDataPoint', chartDataController2)
app.post('/reports', reportsController)



app.get('/getNews', getNewsController)
app.post('/saveNews', saveNewsController)
app.get('/getTags', getTagsController)
app.post('/addTag', addTagController)
app.get('/deleteTag', deleteTagController)




app.listen(3001, () => {
    console.log('Server started at port 3001')
})       