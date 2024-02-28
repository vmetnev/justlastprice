const { secEdgarApi } = require('sec-edgar-api')

async function reportsController(req, res) {
    console.log(req.query)
    const { ticker, service } = req.query
    let send = false
    let reports
    try {
        reports = await secEdgarApi.getReports({ symbol: ticker }).catch(error => {
            console.log(error)
            console.log('-----------------------------------')
            res.json(error)
            send = true
            return
        })
        if (send === true) {
            return
        }
    } catch (error) {
        res.send(error)
        if (send === true) {
            return
        }
        return
    }



    console.log(reports)

    let output = []

    if (reports) {

        for (let q = reports.length - 1; q > -1; q--) {

            if (reports[q].fiscalPeriod === "FY") {
                let instance = {}
                instance.dateReport = (reports[q].dateReport) ? reports[q].dateReport : 0
                instance.fiscalYear = (reports[q].fiscalYear) ? reports[q].fiscalYear : 0
                instance.revenueTotal = (reports[q].revenueTotal) ? reports[q].revenueTotal : 0
                instance.ebit = (reports[q].ebit) ? reports[q].ebit : 0
                instance.eps = (reports[q].eps) ? reports[q].eps : 0
                output.push(instance)
            }
        }

        let structure = {}

        structure.dateReportY0 = (output[0]?.dateReport) ? output[0].dateReport : 0
        structure.fiscalYearY0 = (output[0]?.fiscalYear) ? output[0].fiscalYear : 0
        structure.revenueY0 = (output[0]?.revenueTotal) ? output[0].revenueTotal : 0
        structure.ebitY0 = (output[0]?.ebit) ? output[0].ebit : 0
        structure.epsY0 = (output[0]?.eps) ? output[0].eps : 0

        structure.dateReportY1 = (output[1]?.dateReport) ? output[1].dateReport : 0
        structure.fiscalYearY1 = (output[1]?.fiscalYear) ? output[1].fiscalYear : 0
        structure.revenueY1 = (output[1]?.revenueTotal) ? output[1].revenueTotal : 0
        structure.ebitY1 = (output[1]?.ebit) ? output[1].ebit : 0
        structure.epsY1 = (output[1]?.eps) ? output[1].eps : 0

        structure.dateReportY2 = (output[2]?.dateReport) ? output[2].dateReport : 0
        structure.fiscalYearY2 = (output[2]?.fiscalYear) ? output[2].fiscalYear : 0
        structure.revenueY2 = (output[2]?.revenueTotal) ? output[2].revenueTotal : 0
        structure.ebitY2 = (output[2]?.ebit) ? output[2].ebit : 0
        structure.epsY2 = (output[2]?.eps) ? output[2].eps : 0

        structure.dateReportY3 = (output[3]?.dateReport) ? output[3].dateReport : 0
        structure.fiscalYearY3 = (output[3]?.fiscalYear) ? output[3].fiscalYear : 0
        structure.revenueY3 = (output[3]?.revenueTotal) ? output[3].revenueTotal : 0
        structure.ebitY3 = (output[3]?.ebit) ? output[3].ebit : 0
        structure.epsY3 = (output[3]?.eps) ? output[3].eps : 0

        structure.dateReportY4 = (output[4]?.dateReport) ? output[4].dateReport : 0
        structure.fiscalYearY4 = (output[4]?.fiscalYear) ? output[4].fiscalYear : 0
        structure.revenueY4 = (output[4]?.revenueTotal) ? output[4].revenueTotal : 0
        structure.ebitY4 = (output[4]?.ebit) ? output[4].ebit : 0
        structure.epsY4 = (output[4]?.eps) ? output[4].eps : 0

        structure.dateReportY5 = (output[5]?.dateReport) ? output[5].dateReport : 0
        structure.fiscalYearY5 = (output[5]?.fiscalYear) ? output[5].fiscalYear : 0
        structure.revenueY5 = (output[5]?.revenueTotal) ? output[5].revenueTotal : 0
        structure.ebitY5 = (output[5]?.ebit) ? output[5].ebit : 0
        structure.epsY5 = (output[5]?.eps) ? output[5].eps : 0

        res.json(structure[service])
    } else {
        res.json('no reports')
    }
}



module.exports = reportsController