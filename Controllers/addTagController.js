const newsTag = require('../Models/NewsTag')

async function addTag(req, res) {
    console.log('here in add tag')
    console.log(req.body)

    let existingTag = await newsTag.find({ tag: req.body.tag })
    if (existingTag.length > 0) {
        res.json('already exists')
        return
    }

    let tagToAdd = new newsTag({
        tag: req.body.tag
    })

    tagToAdd.save()

    res.json('saved')
}

module.exports = addTag