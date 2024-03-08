const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');

require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware

app.get("/", function(req,res){
  res.send("This is the face of backend");
});
app.post("/getdata", function(req,res){
  let postdata = req.body;
  console.log("I received some post requests and added to list");
  console.log(postdata);
  res.status(200).send('OK');
});

app.post("/whatsmyport", function(req, res) {
  res.send("Hello");
});

module.exports = app;