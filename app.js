const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
const List = require('collections/list');
const { rejects } = require('assert');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware
var instances = new List();
let mylogger = new List();
app.get("/", function(req,res){
  res.send("This is the face of backend");
})

app.post("/whatsmyport", function(req,res){
  let received_browserid = req.body.browserid;
  
  console.log("Received browserid");
  mylogger.add("Received browserid")
  console.log(received_browserid);
  mylogger.add("received_browserid")
  waitForPostDataPromise = new Promise((resolve,reject) => {
    console.log("In promise, waiting for post request");
    mylogger.add("In promise, waiting for post request")
    let timeout = setTimeout(() => {
      reject("Handshake refused");
  }, 120000); 
    app.post('/getdata', (myreq, myres) => {
        console.log("a post request received, let me check it");
        mylogger.add("a post request received, let me check it");
        let postData = myreq.body;
        console.log("I received this post request");
        mylogger.add("I received this post request");
        console.log(postData)
        mylogger.add(postData);
        if(received_browserid == postData.browserid){
          console.log("Browser ID Matched, Sending 200 OK");
          mylogger.add("Browser ID Matched, Sending 200 OK");
          myres.status(200).json({ message: 'POST request received successfully' });
          console.log("Browser ID Matched, Resolving promise");
          mylogger.add("Browser ID Matched, Resolving promise");
          resolve(postData);
        }     
    });
   });
   console.log("Promise resolved");
   mylogger.add("Promise resolved");
   console.log(waitForPostDataPromise);
   mylogger.add(waitForPostDataPromise);
   instances.add({"browserid": received_browserid, "data_bind": waitForPostDataPromise});
   res.send(waitForPostDataPromise);
});

app.get("/logs", function(req,res){
  res.send(mylogger.toArray());

});
module.exports = app;