const yahooFinance = require('yahoo-finance2').default;
const newsStory = require('../Models/NewsStory')

async function saveNewsContoller(req, res) {
    console.log(req.body)

    let { title, providerPublishTime, link, publisher, uuid, relatedTickers, unixDateAndTime, mainQuery } = req.body


    let existing = await newsStory.find({ uuid: uuid, mainQuery: mainQuery })

    if (existing.length > 0) {
        console.log('allready exists')
        res.json('already exists')
        return
    }

    let storyToSave = new newsStory({
        title: title,
        providerPublishTime: providerPublishTime,
        link: link,
        publisher: publisher,
        uuid: uuid,
        relatedTickers: relatedTickers,
        unixDateAndTime: new Date(unixDateAndTime).valueOf(),
        mainQuery: mainQuery
    })

    await storyToSave.save()


    console.log(title)

    res.json('saved');
}



module.exports = saveNewsContoller