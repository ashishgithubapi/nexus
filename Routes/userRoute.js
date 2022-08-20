const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config()

const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const { name, surname, dateOfBirth, panNumber, pinNumber, ConfirmPinNumber } = req.body;

        // Validate user input
        if (!(name && surname && dateOfBirth && panNumber && pinNumber && ConfirmPinNumber)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ pinNumber });

        if (oldUser) {
            return res.status(409).json({
                msg: 'use is already registered'
            });
        }

        //Encrypt user password
        encryptedPan = await bcrypt.hash(panNumber, 10);

        // Create user in our database
        const user = await User.create({
            name,
            surname,
            dateOfBirth,
            pinNumber, // sanitize: convert email to lowercase
            panNumber:encryptedPan,
            ConfirmPinNumber
        });

        console.log(user);

        // Create token
        const token = jwt.sign(
            { user_id: user._id, pinNumber },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new User
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }

})

router.post('/login', async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const { pinNumber } = req.body;

        // Validate user input
        // if (!(pinNumber)) {
        //     res.status(400).send("All input is required");
        // }
        // Validate if user exist in our database
        const user = await User.findOne({
            pinNumber: req.body.pinNumber,
        });

        User.find(req.body.pinNumber)

       console.log(user);
        // console.log(user.ConfirmPinNumber);
       const conPin = user.ConfirmPinNumber

       console.log(conPin);

         if (!(pinNumber)) {
            res.status(400).send("All input is required");
        }

        if(pinNumber===conPin){
            res.status(400).json({
                pinNumber:pinNumber,
                msg:'login success'

            });

        }
        




        // if (user && (await bcrypt.compare(pinNumber, user.pinNumber))) {
        //     // Create token
        //     const token = jwt.sign(
        //         { user_id: user._id, email },
        //         process.env.TOKEN_KEY,
        //         {
        //             expiresIn: "2h",
        //         }
        //     );

        //     // save user token
        //     user.token = token;

        //     // user
        //     res.status(200).json(user);
        // }
        // res.status(400).send("Invalid Credentials");
    } catch (err) {
        res.status(400).json({
            data:'invalid pin'
        });
 
    }
})






module.exports = router