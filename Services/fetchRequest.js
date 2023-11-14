
// let testUrl = 'https://69.147.92.11/v6/finance/quoteSummary/XOM?modules=summaryDetail&ssl=true'

async function getData(url) {
    return new Promise(async (resolve, reject) => {        
            let response = await fetch(url, {
                headers: {
                    'Host': 'query2.finance.yahoo.com'
                }
            });
            if (response.statusText === "OK") {
                let json = await response.json()
                resolve(json.quoteSummary.result[0])
            } else {
                reject('failed fetch: ' + response.statusText)
            }
        }) 
}

module.exports = getData