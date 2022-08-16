const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken')

// const axios = require('axios');
const otpGenerator = require('otp-generator');
const fast2sms = require('fast-two-sms')




const regOtp = require('../Models/otpregModel')
const VOTP = require('../Models/otpModel')
// const {Otp} = require('../Models/otpModel');

router.post('/regotp', async (req, res) => {
     const User = await regOtp.findOne({
        phone: req.body.phone,
    });
    console.log(User);

    if (User) return res.status(201).send('user already registered');
    const otp_number_genrate = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    });

    console.log("otp number generate " + otp_number_genrate);
    const mobile_number = req.body.phone;
    const otp_obj = new VOTP({ phone: mobile_number, otp: otp_number_genrate });
    console.log(otp_obj);
    const salt = await bcrypt.genSalt(10);
    var otp_hash = await bcrypt.hash(otp_number_genrate, salt);
    otp_obj.otp = otp_hash;
    const result = await otp_obj.save();
    res.status(200).json({
        result: otp_obj
    })
     var options = { authorization: 'WJw0ePjNbqgi3185Vpz4HMFhXYIxDOKfCTyvr6Zkc7s2EmnBduPM9JR5p0GtENnDcwlg8oQCV7ZdSurX', message:`${otp_number_genrate}` , numbers:[mobile_number] }
     fast2sms.sendMessage(options) //Asynchronous Function.
})

router.post('/verifyotp', async (req, res) => {
    console.log('ashish');
    const otpHolder = await VOTP.find({
        phone: req.body.phone
    });

    //   console.log(otpHolder);

    if (otpHolder.length == 0) return res.status(201).send({
        message: "Please enter valid OTP",
        err: true,
        data: []
    })
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    //   console.log(rightOtpFind+"otpfind");
    //   console.log(req.body.otp+" yeh body me otp hai");
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
    //   console.log(validUser+"valid aaya");

    if (rightOtpFind.phone === req.body.phone && validUser) {

        const user = new regOtp(_.pick(req.body, ['phone']));
        console.log(user);

        const token = jwt.sign({
            user: user.phone,

        },
            'this is dummy text as',
            {
                expiresIn: "24h"
            }
        );
        // const token = user.generateJWT();


        //    let is_register=0;
        //    let userObject={};

        //    if(getUserObject.length==0){
        //     userObject = { 'name': '', 'email': '', 'address':'', 'pincode':'','otp':rightOtpFind.otp  };
        //    }
        //    else{
        //     is_register=1;

        //     userObject =getUserObject;
        //     userObject['otp']=rightOtpFind.otp;
        //    }

        //localStorage.setItem(''+rightOtpFind.number+'', JSON.stringify(userObject));



        return res.status(200).send({
            message: "verify otp successful",
            // data: getUserObject,
            // is_register:is_register,
            err: false,
            data: user.phone,

            token: token,
            // data: result
        });

    } else {
        return res.status(201).send({
            message: "otp was wrong",
            err: true,
            data: []
        })
    }

})

module.exports = router