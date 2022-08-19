const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const cookie = require('cookie-parser')
// const nodemailer = require('nodemailer');

// const fast2sms = require('fast-two-sms')

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'am5932809@gmail.com',
//         pass: 'bhzboedeiqshfdww'
//     }
// })





router.post('/signup', async (req, res) => {


    const user = await User.findOne({
        panNumber: req.body.panNumber,
    });

    if (user) return res.status(201).send('user already registered');

    // const otp_number_genrate = otpGenerator.generate(6, {
    //     digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    // });//otp number random genrate


    bcrypt.hash(req.body.ConfirmPinNumber, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {


            const user = new User({
                name: req.body.name,
                surname: req.body.surname,
                panNumber: hash,
                dateOfBirth:req.body.dateOfBirth,
                pinNumber: req.body.pinNumber,
                ConfirmPinNumber: req.body.ConfirmPinNumber,
                pinToken: crypto.randomBytes(64).toString('hex'),
                isVerified: false
            })


            user.save()
            res.status(200).json({
               msg:user
            })

            // var mailOptions = {
            //     from: 'am5932809@gmail.com',
            //     to: user.email,
            //     subject: 'Pin for login',
            //     text: `your pin for login is ${user.pinNumber}`
            //     //     html:`
            //     //     <h2>${user.name}!thanks for registering on our app
            //     //     <a href = "http://${req.headers.host}/user/verify-email?token=${user.pinToken}">verify your email</a>`
            //     //   }
            // }
            // transporter.sendMail(mailOptions, function (err, info) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     else {
            //         res.send({
            //             msg: "please check your gmail account for pin",
            //             data: user
            //         })
            //     }
            // })



        }
    })

})





const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

router.post('/login', async (req, res) => {

    try {
        const { pinNumber } = req.body

        const user = await User.findOne({ pinNumber: pinNumber })

        if (user) {
            if (user.pinNumber === req.body.pinNumber) {
                console.log('login success');

                user.isVerified = true
                user.pinToken = null

                user.save()
                res.status(200).json({
                    data:'login success'
                })

            }
           
        }
        // console.log(user);
        // console.log(user.isVerified);
        // user.isVerified = true
        // user.save()




        // if(user){
        //     const match = await bcrypt.compare(pinNumber,user.pinNumber)
        //     if(match){
        //         const token = createToken(user.id)
        //         console.log("this is token "+token);
        //         res.cookie('access-token',token)
        //         console.log('login success');
        //     }
        //     else{
        //         console.log('Invalid pin');
        //     }
        // }
        // else{
        //     console.log('user not register');
        // }

    } catch (error) {
       console.log(error);
       res.status(401).json({
         msg:error
       })
    }

})



module.exports = router