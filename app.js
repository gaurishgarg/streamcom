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

    await page.goto("https://projectbase-gaurish.streamlit.app/");
    
    // Wait for the iframe to be available
  await page.waitForSelector('iframe');

  // Get the handle of the iframe element
  const iframeHandle = await page.$('iframe');

  // Evaluate JavaScript code within the context of the iframe to extract its HTML content
  const iframeHTML = await page.evaluate((iframe) => {
    // Access the contentDocument of the iframe to interact with its DOM
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
    // Access the HTML content of the iframe
    return iframeDocument.documentElement.outerHTML;
  }, iframeHandle);

  console.log(iframeHTML); // Print or use the iframe HTML content as needed

  res.send(iframeHTML);

  await browser.close();
    
    // Print or use the iframe HTML content as needed

    // Print the full title
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
