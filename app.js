const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
const List = require('collections/list');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware

app.post('/getdata', function(req, res) {
  console.log("Data Received:", req.body);
  res.sendStatus(200); // Send a 200 status code
});
app.get("/", function(req,res){
  res.send("This is the face of backend");
})
module.exports = app;
