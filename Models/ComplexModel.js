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

database.collectionName = 'complex'

const Complex = mongoose.model(
    database.collectionName,
    new Schema({
        ticker: String,
        arr: [String], // alternatively can be another mongoose model!
        object: String
    })
)

module.exports = Complex