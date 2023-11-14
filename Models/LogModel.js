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
database.collectionName = 'accessLogs'

const accessLog = mongoose.model(
    database.collectionName,
    new Schema({
        dateAndTime: Number,        
        logSource: String,     
        baseurl:String,
        body:String,
        cookies:String,
        fresh:String,
        hostname:String,
        ip:String,
        ips:String,
        originalurl:String,
        params:String,
        path:String,
        protocol:String,
        query:String,
        route:String,        
    })
)

module.exports = accessLog