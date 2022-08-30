const express = require('express');
require('dotenv').config()

const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken')
const Sib = require("sib-api-v3-sdk")
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
// const nodemailer = require('nodemailer');


const otpGenerator = require('otp-generator');




const eamilregOtp = require('../Models/emailotpregModel')
const EOTP = require('../Models/emailotpModel')
// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure:false, // true for 465, false for other ports
//     auth:{
//         user:'noreply@nexustradingworld.com',
//         pass:'tkljpvcdpxytjnrg'
//     },
//     tls: {
//         // do not fail on invalid certs
//         rejectUnauthorized: false
//     }
// })

router.post('/emailotp', async (req, res) => {
     const User = await eamilregOtp.findOne({
        email: req.body.email,
    });

    console.log(User);

    if (User) return res.status(201).send('user already registered');
    const otp_number_genrate = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    });

    console.log("otp number generate " + otp_number_genrate);
    const email_id = req.body.email;
    const email_obj = new EOTP({ email: email_id, otp: otp_number_genrate });
    console.log(email_obj);
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp_number_genrate, salt);
    email_obj.otp = otpHash;
    const result = await email_obj.save();
    res.status(200).json({
        result: email_obj
    })
    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
        email: 'noreply@nexustradingworld.com',
        
    }
    
    const recievers = [{
        email:email_id
    }]
    
    tranEmailApi.sendTransacEmail({
        sender,
        to:recievers,
        subject:'email otp verification',
        textContent:`
         <img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOyCtPSy5vZ6NNKe6nmW5aEAWDfv2R3bV72g&usqp=CAU" style="border-radius: 70%; height:90px;width:90px"><br>

         dear user please use ${otp_number_genrate} as your one time password (OTP) to log into your nexus trade account<br>
         this password is only valid for 30 minutes<br>
         for security reason, please do not share this otp with anyone
         `
    })
    .then(console.log)
    .catch(console.log)    //   .then(() => console.log('success', email_obj))
    // .catch(error => console.error('There was an error while sending the email:', error));


     
})

router.post('/emailverifyotp',async(req,res)=>{

    console.log('ashish');
    const otpHolder = await EOTP.find({
        email: req.body.email
    });

      console.log("this is what we want"+otpHolder);

      if (otpHolder.length == 0) return res.status(201).send({
        message: "Please enter valid OTP",
        err: true,
        data: []
    })
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    //   console.log(rightOtpFind+"otpfind");
    //   console.log(req.body.otp+" yeh body me otp hai");
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
      console.log(validUser+"valid aaya");

    if (rightOtpFind.email === req.body.email && validUser) {

        const user = new eamilregOtp(_.pick(req.body, ['email']));
        console.log(user);

        const token = jwt.sign({
            user: user.phone,

        },
            'this is dummy text assu',
            {
                expiresIn: "24h"
            }
        );
      
        return res.status(200).send({
            message: "verify otp successful",

            err: false,
            data: user.email,

            token: token,
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