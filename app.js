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
})

app.post("/whatsmyport", function(req,res){
  let received_browserid = req.body.browserid;
  waitForPostDataPromise = new Promise(resolve => {
    let timeout = setTimeout(() => {
      reject("Handshake refused");
  }, 120000); 
    app.post('/getdata', (myreq, myres) => {
        const postData = myreq.body;
        if(received_browserid == postData.browserid){
          myres.status(200).json({ message: 'POST request received successfully' });
          resolve(postData);
        }     
    });
   });
   console.log("Promise resolved");
   console.log(waitForPostDataPromise);
   instances.add({"browserid": received_browserid, "data_bind": waitForPostDataPromise});
   res.send(waitForPostDataPromise);
});
module.exports = app;
