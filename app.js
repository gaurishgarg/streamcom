const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
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
    let con = await mongoose.connect(DB);
    console.log(con);
    conn = mongoose.connection;
  }
  addresses_data.save(function(err){
    if(err){
      console.log("an error occured");
    }
  });
  console.log("I received some post requests and added to list");
  console.log(postdata);
  res.status(200).send('OK');
});

app.post("/whatsmyport", async function(req, res) {
  if(conn.readyState==1){

  }
  else{
    let DB = process.env.URL;
    let con = await mongoose.connect(DB);
    console.log(con);
    conn = mongoose.connection;

  }
  address.findOne({browserid: req.browserid},function(err,data){
    if(err){
      console.log("Could not find matching pair, sending null");
      res.send({});
    }
    else{
      console.log("Found data");
      res.send(data);
    }
  })
});

module.exports = app;