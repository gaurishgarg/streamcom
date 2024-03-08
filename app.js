const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
const List = require('collections/list');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware
var instances = new List();
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
app.get("/", async function(req,res){
  test();
  res.send("This is the face of backend");
});
app.post("/getdata", function(req,res){
  let postdata = req.body;
  console.log("I received some post requests and added to list");
  instances.add(postdata);
  console.log("Added");
  res.status(200).send('OK');
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
async function test(){
  await s3.putObject({
    Body: JSON.stringify({key:"value"}),
    Bucket: "cyclic-long-erin-abalone-gown-eu-north-1",
    Key: "some_files/my_file.json",
  }).promise();
  
  // get it back
  let my_file = await s3.getObject({
    Bucket: "cyclic-long-erin-abalone-gown-eu-north-1",
    Key: "some_files/my_file.json",
  }).promise();
  
  console.log(JSON.parse(my_file));

}

module.exports = app;