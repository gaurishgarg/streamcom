const bodyParser = require('body-parser'); // Import body-parser middleware
const express = require('express');
const List = require('collections/list');
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser middleware

let allpostdata = new List();
counter = 0;

let allbrowsers = new List();
const puppeteer = require("puppeteer");
const { count } = require('console');
require("dotenv").config();


let postData = {};
function generateBrowserId() {
    // Generate a timestamp
    const timestamp = Date.now();
    // Generate a random alphanumeric string
    const randomString = Math.random().toString(36);
    // Combine timestamp and random string to create a partial ID
    const partialId = `${timestamp}-${randomString}`;

    counter++;
    // Add a counter to handle cases where instances are created within the same millisecond
    // Combine partial ID and counter to create the final ID
    return `${partialId}-${counter}`;
  }


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
    let browserId = generateBrowserId();
    let gotopath = "https://projectbase-gaurish.streamlit.app/?browserId=${"+ browserId+"}";
    await page.goto(gotopath);

      // Extract the innerHTML of the <body> element
    //   const streamlitInfo = await page.evaluate(() => {
    //     // Access the injected script and extract the information
    //     return window.streamlitInfo || {};
    //   });

    const postDataPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject("Timeout: No POST request received within the specified time.");
        }, 60000); 
        app.post('/getdata', function(req,myres){
            let this_Flag = true;
            console.log('Received data:', req.body);
            postData = req.body;
            for(let i=0;i<allbrowsers.length;i++){
                if(allbrowsers[i].browserid == postData.browserid){
                    this_Flag = false;
                    allpostdata.add(postData);
                            // Respond to the client
                    myres.status(200).json({ message: 'POST request received successfully' });
                    resolve(postData);
                    break;
                }
            }
            if(this_Flag==true){
                reject({"Error": "Browser Not Found"});
            }
         
            });
    });

    // Wait for the post request to be received
    const receivedData = await postDataPromise;

    let data_to_send = {}
    
    for(let i=0;i<allpostdata.length;i++){
        if(allpostdata[i].browserid == browserId){
            data_to_send = allpostdata[i];
        }
    }
    allbrowsers.add({"browser": browser, "browserid": browserId, "associated": data_to_send});
    res.send(data_to_send);

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

app.post('/closemybrowser', function(req,res){
    var data = req.body;
    for(let i=0;i<allbrowsers.length;i++){
        if(allbrowsers[i].browserid == data.mybrowserid){
            allbrowsers[i].browser.close();
            allbrowsers.delete(allbrowsers[i]);
            counter--;
        }
    }
})


module.exports = app;
