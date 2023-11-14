const mongoose = require('mongoose')

const {
    Schema
} = mongoose;

const database = {
    uri: "mongodb://127.0.0.1:27017/",
    name: "justlastprice",
    user: "",
    password: "",
    options: {},
};

database.collectionName = 'softCoded'

const SoftCoded = mongoose.model(
    database.collectionName,
    new Schema({
        ticker: String,
        moduleName:String,
        queryResult: String,
        timeSaved: Number,
        date: String,
        maxLifeTimeType:String,
        maxLifeTime: Number
    })
)

module.exports = SoftCoded