const newsTag = require('../Models/NewsTag')

async function deleteTag(req, res) {

    console.log(req.query)

    let target = await newsTag.findOneAndDelete({ tag: req.query.tag })
    


    res.json('removed');
}

module.exports = deleteTag