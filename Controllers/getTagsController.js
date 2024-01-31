const newsTag = require('../Models/NewsTag')

async function getTags(req, res) {
    let tags = await newsTag.find({})
    res.json(tags);
}

module.exports = getTags