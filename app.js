const express = require('express');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));

let postData = {}; // Variable to store the POST data


const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://developer.chrome.com/");

    let content = await page.content()
    console.log(content);

    // Print the full title
    res.send(content);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};



app.get("/connectme", async function (req, res) {
    scrapeLogic(res);
});


app.post('getdata', function(req,res){
    console.log('Received data:', req.body);
    postData = req.body;
    // Respond to the client
    res.status(200).json({ message: 'POST request received successfully' });
});

module.exports = app;
