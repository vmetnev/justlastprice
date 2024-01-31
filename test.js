const yahooFinance = require('yahoo-finance2').default;

let ticker = "SPTL"

query(ticker)

async function query(ticker){
    // let response = await yahooFinance.quoteSummary(ticker, { modules: ["defaultKeyStatistics"] })
    // console.log(response)

    let response1 = await yahooFinance.quoteSummary(ticker, { modules: ["defaultKeyStatistics"] })
    console.log(response1)

    
    // const query = 'TSLA';
    // const queryOptions = { period1: '2021-02-01', /* ... */ };
    // const result = await yahooFinance.historical(query, queryOptions);  
    // console.log(result)


}

