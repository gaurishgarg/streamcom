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

app.get("/logs", function(req,res){
  res.send(mylogger.toArray());

});


app.post("/whatsmyport", async function(req, res) {
  try {
      let received_browserid = req.body.browserid;

      console.log("Received browserid", received_browserid);
      mylogger.add("Received browserid: " + received_browserid);

      let data_to_Send = await new Promise((resolve, reject) => {
          console.log("In promise, waiting for post request");
          mylogger.add("In promise, waiting for post request");

          let timeout = setTimeout(() => {
              reject("Handshake refused");
          }, 120000);

          app.post('/getdata', (myreq, myres) => {
              console.log("a post request received, let me check it");
              mylogger.add("a post request received, let me check it");

              let postData = myreq.body;

              console.log("I received this post request:", postData);
              mylogger.add("I received this post request: " + JSON.stringify(postData));

              if (received_browserid == postData.browserid) {
                  console.log("Browser ID Matched, Sending 200 OK");
                  mylogger.add("Browser ID Matched, Sending 200 OK");

                  myres.status(200).json({ message: 'POST request received successfully' });
                  console.log("Browser ID Matched, Resolving promise");
                  mylogger.add("Browser ID Matched, Resolving promise");

                  resolve(postData);
              } else {
                  myres.status(400).json({ message: 'Browser ID does not match' });
              }
          });
      });

      console.log("Promise resolved with data:", data_to_Send);
      mylogger.add("Promise resolved with data: " + JSON.stringify(data_to_Send));

      instances.add({ "browserid": received_browserid, "data_bind": data_to_Send });

      console.log("Sending back the following:", data_to_Send);
      res.send(data_to_Send);
  } catch (error) {
      console.error("Error in /whatsmyport:", error);
      mylogger.add("Error in /whatsmyport: " + error);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = app;