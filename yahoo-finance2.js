const yahooFinance = require('yahoo-finance2').default;


getMyData("AAPL")

async function getMyData(ticker){

  const results = await yahooFinance.quoteSummary(ticker, { modules: [ "price" ] })

  console.log(results.price)

}