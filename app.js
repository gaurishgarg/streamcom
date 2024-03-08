const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
const List = require('collections/list');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware
var instances = new List();
app.get("/", function(req,res){
  res.send("This is the face of backend");
});
app.post("/getdata", function(req,res){
  let postdata = req.body;
  console.log("I received some post requests and added to list");
  instances.add(postdata);
  res.statusCode(200);
});

app.post("/whatsmyport", function(req, res) {
  console.log("I have all these instances only. Poll again until you get a response");
  let flag = false;
  let received_browserid = req.body.browserid;
  for(let i=0;i<instances.length;i++){
    if(instances.toArray()[i].browserid == received_browserid){
      flag =true;
      break;
    }
  }
  if(flag==true){
    console.log("Matching request found");
    console.log("Sending data");
    res.send(req.body);
  }
  else{
    console.log("No matching request found. Sending null");
    res.send({});
  }

});
module.exports = app;