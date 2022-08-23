const express = require('express');

const router = express.Router();

var KiteConnect = require("kiteconnect").KiteConnect;


router.post('/accountlogin',(req,res)=>{
    console.log('ashish');


    var kc = new KiteConnect({
        api_key: "p9v3cz9ahvlxilq8"
    });
    
    kc.generateSession("request_token", "api_secret")
        .then(function(response) {
            init();
        })
        .catch(function(err) {
            console.log(err);
        });
    
    function init() {
        // Fetch equity margins.
        // You can have other api calls here.
        kc.getMargins()
            .then(function(response) {
                // You got user's margin details.
            }).catch(function(err) {
                // Something went wrong.
            });
    }
    
})


module.exports = router