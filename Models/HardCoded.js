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

database.collectionName = 'hardCoded'

const HardCoded = mongoose.model(
    database.collectionName,
    new Schema({
        ticker: String,
        name: String,
        industry: String,
        sector: String,
        description: String,
        priceCurrency: String,
        country: String,
        site: String,
        financialCurrency: String,
        dateCreated: Number
    })
)

module.exports = HardCoded