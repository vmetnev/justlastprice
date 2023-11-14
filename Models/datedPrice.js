const mongoose = require("mongoose");
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
database.collectionName = 'datedPrices'

const datedPrice = mongoose.model(
    database.collectionName,
    new Schema({
        ticker: String,
        ddate: String,
        price: Number
    })
)

module.exports = datedPrice