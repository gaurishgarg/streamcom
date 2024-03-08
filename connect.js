const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
console.log("Connecting to Database");
const DB = process.env.URL;
mongoose.connect(DB,{
    
}).then(con=>{
    console.log("DB Connection Successful");
});
const conn = mongoose.connection;
module.exports = conn;