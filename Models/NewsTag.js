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
database.collectionName = 'newstags'

const newsTag = mongoose.model(
    database.collectionName,
    new Schema({
        tag: String,
    })
)

module.exports = newsTag