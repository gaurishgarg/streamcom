const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
app.use(express.urlencoded({ extended: true }));

let postData = {}; // Variable to store the POST data



async function scrapeDataFromWebPage() {
    try {
        const response = await axios.get('https://projectbase-gaurish.streamlit.app/');
        console.log(esponse.data);
        const $ = cheerio.load(response.data);
        // Use Cheerio selectors to extract data from the page
        // const data = $('selector').text();
        postData = {"demo":"Demo"};
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}



app.get("/connectme", async function (req, res) {
    await scrapeDataFromWebPage();
    res.send(postData);
});


app.post('getdata', function(req,res){
    console.log('Received data:', req.body);
    postData = req.body;
    // Respond to the client
    res.status(200).json({ message: 'POST request received successfully' });
});

module.exports = app;
