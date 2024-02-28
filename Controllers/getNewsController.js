
 
const yahooFinance = require('yahoo-finance2').default;


async function getNewsController(req,res){
    console.log(req.query.text);
    const result = await yahooFinance.search(
      req.query.text,
      { newsCount: 50 } /* queryOptions */
    );

  
    res.json(result.news);
}



module.exports = getNewsController