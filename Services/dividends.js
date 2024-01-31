const yahooFinance = require('yahoo-finance2').default;

getMyData("AAPL")

async function getMyData(ticker) {

    // news
    //   const query = 'MDB';
    //   const result = await yahooFinance.search(query,{newsCount:10});
    //   console.log(result)


    // dividends
    const query = 'EWZ'
    const queryOptions = { period1: '2023-12-27', period2: '2024-01-25', return: "object", /* ... */ };
    const result = await yahooFinance.chart(query, queryOptions);


    if (result.events) {
        let dividend = 0
        for (key in result.events.dividends) {
            dividend += result.events.dividends[key].amount
            console.log(result.events.dividends[key])
        }
        console.log(dividend)

    } else {
        console.log('no dividends found')
    }
}