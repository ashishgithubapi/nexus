
// const express = require('express');
// const router = express.Router();
// var KiteConnect = require("kiteconnect").KiteConnect;
// var sha256 = require("crypto-js/sha256");



//  router.post('/kitelogin',(req,res)=>{
//     console.log('ashish');
 
// var kc = new KiteConnect({
//   api_key: "p9v3cz9ahvlxilq8",

// });
// const key = kc.api_key
// console.log(key);
// const secret =  "4h26xpge8ky3dzf44f1g57p16e9oo1zz"
// const requestToken = "G8RnYSv8GXyCUA69j3w8z6BZxhiz2Q3e"





 
// // kc.generateSession(requestToken, secret)
// //   .then(function (response) {
// //     init();
// //   })
// //   .catch(function (err) {
// //     console.log(err);
// //   });
 
// // function init() {
// // //   Fetch equity margins.
// // //   You can have other api calls here.
// //   kc.getMargins()
// //     .then(function (response) {
// //       // You got user's margin details.
// //       console.log(response);
// //     })
// //     .catch(function (err) {
// //       // Something went wrong.
// //       console.log(err);
// //     });
    
  


// // }
//  })

// module.exports = router

const puppeteer = require("puppeteer");
const KiteConnect = require('kiteconnect').KiteConnect;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
function zerodhaLogin(ApiKey,SecretKey,UserId,Password,Pin) {
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(
          `https://kite.trade/connect/login?api_key=${ApiKey}&v=3`
        );
        await sleep(2000);
        await page.type("input[type=text]", UserId);
        await page.type("input[type=password]", Password);
        await page.keyboard.press("Enter");
        await sleep(2000);
        await page.focus("input[type=text]").then((value) => console.log(value));
        await page.keyboard.type(Pin);
        await page.keyboard.press("Enter");
        await page.waitForNavigation();
        const reqUrl = page.url();
        console.log("Page URL:", page.url());
        const requestToken = new URL(reqUrl).searchParams.get('request_token');
        console.log("Request Token: ", requestToken);
        await browser.close();
        try{
          const kc = new KiteConnect({
            api_key: ApiKey,
          });
          const response = await kc.generateSession(requestToken, SecretKey);
          const accessToken = response.access_token;
          console.log("Access Token: ",accessToken);
        }catch (e){
          console.error(e);
        }
      })();
}
module.exports = zerodhaLogin