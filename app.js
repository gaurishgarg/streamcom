const bodyParser = require('body-parser');
const express = require('express');
const List = require('collections/list');
const AWS = require("aws-sdk");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const s3 = new AWS.S3();
const bucketName = "cyclic-long-erin-abalone-gown-eu-north-1";
const fileName = "some_files/my_file.json";

var instances = new List();

app.get("/", function(req, res){
    res.send("This is the face of backend");
});

app.post("/getdata", async function(req, res){
    try {
        let myFile = await s3.getObject({
            Bucket: bucketName,
            Key: fileName
        }).promise();

        console.log(myFile);

        var tempInstances = new List(JSON.parse(myFile.Body.toString()));
        tempInstances.add(req.body);
        instances = tempInstances;

        await s3.putObject({
            Body: JSON.stringify(instances.toArray()),
            Bucket: bucketName,
            Key: fileName
        }).promise();

        console.log("Data added successfully");
        res.status(200).send('OK');
    } catch (error) {
        console.error("Error in /getdata:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/whatsmyport", async function(req, res) {
    try {
        let receivedBrowserId = req.body.browserid;

        let myFile = await s3.getObject({
            Bucket: bucketName,
            Key: fileName
        }).promise();

        console.log(myFile);

        var tempInstances = new List(JSON.parse(myFile.Body.toString()));
        instances = tempInstances;

        let flag = instances.some(item => item.browserid === receivedBrowserId);

        if (flag) {
            console.log("Matching request found");
            console.log("Sending data");
            res.send(req.body);
        } else {
            console.log("No matching request found. Sending null");
            res.send({});
        }
    } catch (error) {
        console.error("Error in /whatsmyport:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = app;
