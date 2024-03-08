const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware
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

    await page.goto("https://projectbase-gaurish.streamlit.app/");

      // Extract the innerHTML of the <body> element
      const streamlitInfo = await page.evaluate(() => {
        // Access the injected script and extract the information
        return window.streamlitInfo || {};
      });
      await waitForPostData();
      res.send({
        "port": streamlitInfo.port,
        "url": streamlitInfo.url,
        "postdata": postData
      });
  
      console.log({
        "port": streamlitInfo.port,
        "url": streamlitInfo.url,
        "postdata": postData
      });
  // Print or use the extracted information

    
  function waitForPostData() {
    return new Promise((resolve) => {
      if (Object.keys(postData).length > 0) {
        resolve();
      } else {
        setTimeout(() => {
          waitForPostData().then(resolve);
        }, 100); // Adjust the delay as needed
      }
    });
  }
  await browser.close();
    
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


app.post('/getdata', function(req,res){
    console.log('Received data:', req.body);
    postData = req.body;
    // Respond to the client
    res.status(200).json({ message: 'POST request received successfully' });
});

module.exports = app;
