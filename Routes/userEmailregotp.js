const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');


const otpGenerator = require('otp-generator');




const eamilregOtp = require('../Models/emailotpregModel')
const EOTP = require('../Models/emailotpModel')
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'am5932809@gmail.com',
        pass:'bhzboedeiqshfdww'
    }
})

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
    var mailOptions = {
        from:'am5932809@gmail.com',
        to:email_obj.email,
        subject:'email verification',
        text: `your otp is ${otp_number_genrate}`
    }
     
      transporter.sendMail(mailOptions)
     
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