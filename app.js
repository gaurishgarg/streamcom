const express = require('express');

const app = express();


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
let postData = {}; // Variable to store the POST data

const puppeteer = require('puppeteer');

async function runStreamlitHeadlessly() {
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();
    await page.goto('https://projectbase-gaurish.streamlit.app/');
      // Extract JSON data from the Streamlit UI
    // Extract information from the Streamlit UI
    const pageContent = await page.content();

    // Extract JSON data from the page content
    console.log(pageContent)
}


app.get("/connectme",async function(req,res){
    await runStreamlitHeadlessly();
    res.send(postData);
});


app.post('/getdata', function(req,res){
    console.log('Received data:', req.body);
    postData = req.body;
    // Respond to the client
    res.status(200).json({ message: 'POST request received successfully' });
})




module.exports = app;
