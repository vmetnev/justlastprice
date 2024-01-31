const yahooFinance = require('yahoo-finance2').default;

getMyData("XOM")

async function getMyData(ticker) {

    const incomeStatement = (await yahooFinance.quoteSummary(ticker, { modules: ["incomeStatementHistory"] })).incomeStatementHistory.incomeStatementHistory
    const balanceSheet = (await yahooFinance.quoteSummary(ticker, { modules: ["balanceSheetHistory"] })).balanceSheetHistory.balanceSheetStatements
    const cashFlow = (await yahooFinance.quoteSummary(ticker, { modules: ["cashflowStatementHistory"] })).cashflowStatementHistory.cashflowStatements

    const incomeStatementQuarterly = (await yahooFinance.quoteSummary(ticker, { modules: ["incomeStatementHistoryQuarterly"] })).incomeStatementHistoryQuarterly.incomeStatementHistory
    const balanceSheetQuarterly = (await yahooFinance.quoteSummary(ticker, { modules: ["balanceSheetHistoryQuarterly"] })).balanceSheetHistoryQuarterly.balanceSheetStatements
    const cashFlowQuarterly = (await yahooFinance.quoteSummary(ticker, { modules: ["cashflowStatementHistoryQuarterly"] })).cashflowStatementHistoryQuarterly.cashflowStatements

    console.log(incomeStatementQuarterly)

    /* 
        // INCOME STATEMENT
        let ISReport = {}
        let counter = 0
        incomeStatement.forEach(item => {
    
            for (key in item) {
                if (!ISReport[key]) {
                    ISReport[key] = []
    
                    if (counter > 0) {
                        for (let q = 0; q < counter; q++) {
                            ISReport[key].push(0)
                        }
                    }
                }
            }
    
            for (key in ISReport) {
                if (item[key]) {
                    ISReport[key].push(item[key])
                } else {
                    ISReport[key].push("n.a")
                }
            }
            counter++
        })
    
        for (key in ISReport){
            ISReport[key].reverse()
        }
    
        console.log(ISReport)
      
        // Balance  STATEMENT
        
     let BSReport = {}
      counter = 0
      balanceSheet.forEach(item => {
    
         for (key in item) {
             if (!BSReport[key]) {
                 BSReport[key] = []
    
                 if (counter > 0) {
                     for (let q = 0; q < counter; q++) {
                         BSReport[key].push(0)
                     }
                 }
             }
         }
    
         for (key in BSReport) {
             if (item[key]) {
                 BSReport[key].push(item[key])
             } else {
                 BSReport[key].push("n.a")
             }
         }
         counter++
     })
    
     for (key in BSReport){
         BSReport[key].reverse()
     }
    
     console.log(BSReport)
    
         // CASHFLOW STATEMENT
         let CFReport = {}
         counter = 0
         cashFlow.forEach(item => {
       
            for (key in item) {
                if (!CFReport[key]) {
                    CFReport[key] = []
       
                    if (counter > 0) {
                        for (let q = 0; q < counter; q++) {
                            CFReport[key].push(0)
                        }
                    }
                }
            }
       
            for (key in CFReport) {
                if (item[key]) {
                    CFReport[key].push(item[key])
                } else {
                    CFReport[key].push("n.a")
                }
            }
            counter++
        })
       
        for (key in CFReport){
            CFReport[key].reverse()
        }
       
        console.log(CFReport)*/


       // Income Statement Quarterly
//        let ISQuarterly = {}
//        counter = 0
//        incomeStatementQuarterly.forEach(item => {
     
//           for (key in item) {
//               if (!ISQuarterly[key]) {
//                   ISQuarterly[key] = []
     
//                   if (counter > 0) {
//                       for (let q = 0; q < counter; q++) {
//                           ISQuarterly[key].push(0)
//                       }
//                   }
//               }
//           }
     
//           for (key in ISQuarterly) {
//               if (item[key]) {
//                   ISQuarterly[key].push(item[key])
//               } else {
//                   ISQuarterly[key].push("n.a")
//               }
//           }
//           counter++
//       })
     
//       for (key in ISQuarterly){
//           ISQuarterly[key].reverse()
//       }
     
//       console.log(ISQuarterly)


//   // Balancesheet Quarterly
//   let BSQuarterly = {}
//   counter = 0
//   balanceSheetQuarterly.forEach(item => {

//      for (key in item) {
//          if (!BSQuarterly[key]) {
//              BSQuarterly[key] = []

//              if (counter > 0) {
//                  for (let q = 0; q < counter; q++) {
//                      BSQuarterly[key].push(0)
//                  }
//              }
//          }
//      }

//      for (key in BSQuarterly) {
//          if (item[key]) {
//              BSQuarterly[key].push(item[key])
//          } else {
//              BSQuarterly[key].push("n.a")
//          }
//      }
//      counter++
//  })

//  for (key in BSQuarterly){
//      BSQuarterly[key].reverse()
//  }

//  console.log(BSQuarterly)


 // CF Quarterly
 let CFQuarterly = {}
 counter = 0
 cashFlowQuarterly.forEach(item => {

    for (key in item) {
        if (!CFQuarterly[key]) {
            CFQuarterly[key] = []

            if (counter > 0) {
                for (let q = 0; q < counter; q++) {
                    CFQuarterly[key].push(0)
                }
            }
        }
    }

    for (key in CFQuarterly) {
        if (item[key]) {
            CFQuarterly[key].push(item[key])
        } else {
            CFQuarterly[key].push("n.a")
        }
    }
    counter++
})

for (key in CFQuarterly){
    CFQuarterly[key].reverse()
}

console.log(CFQuarterly)


}