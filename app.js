const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
const mongoose = require('mongoose');
let conn = require('./connect');
const address = require('./schema');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware

app.get("/", function(req,res){
  res.send("This is the face of backend");
});
app.post("/getdata", async function(req,res){
  let postdata = req.body;
  var addresses_data= new address({
    browserid: req.body.browserid,
    browserport: req.body.port,
    postdataurl: req.body.url
  });
  if(conn.readyState==1){

  }
  else{
    let DB = process.env.URL;
    let mycon = null;
    await mongoose.connect(DB).then(function(con){
      mycon = con;
    });
    conn = mongoose.connection;
  }
  await addresses_data.save().then().catch(err =>{
    console.log("An error occured");
  })
 
  console.log("I received some post requests and added to list");
  console.log(postdata);
  res.status(200).send('OK');
});

app.post("/whatsmyport", async function(req, res) {
  if(conn.readyState==1){

  }
  else{
    let DB = process.env.URL;
    let mycon = null;
    await mongoose.connect(DB).then(function(con){
      mycon = con;
    });
    
    conn = mongoose.connection;

  }
  address.findOne({browserid: req.body.browserid}).then(data=>{
    if(data!=null){
      console.log("Found data");
      console.log("Data I found: "+data);
      res.send(data);
    }
    else{
      res.send({});  
    }
  }).catch(err=>{
    console.log("Internal Error, sending null");
    console.log(err);
    res.send({});});
});

module.exports = app;
     