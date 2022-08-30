const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config()

const jwt = require('jsonwebtoken')

router.post('/reg', async (req, res) => {

    const oldUser = await User.findOne({ pinNumber: req.body.pinNumber });

    if (oldUser) {
        return res.status(201).json({
            msg: 'user is registered'
        });
    }

    else {

        const user = await new User({
            name:req.body.name,
            surname:req.body.surname,
            dateOfBirth:req.body.dateOfBirth,
            pinNumber:req.body.pinNumber, // sanitize: convert email to lowercase
            panNumber:req.body.panNumber,
            ConfirmPinNumber:req.body.ConfirmPinNumber,
            isVerified: false
        });

        user.save()

        res.status(200).json({
            msg: 'registration successfull'
        })

    }
    // const oldUser = await User.findOne({ pinNumber:req.body.pinNumber });


    // if (oldUser) {
    //     return res.status(201).json({
    //         msg: 'user is register'
    //     });
    // }




    // const { name, surname, dateOfBirth, panNumber, pinNumber, ConfirmPinNumber } = req.body;

    // // Validate user input
    // if (!(name && surname && dateOfBirth && panNumber && pinNumber && ConfirmPinNumber)) {
    //    return res.status(200).json({
    //         message: 'please fill given field'
    //     });
    // }


    // // Create user in our database
    // const user = await new User({
    //     name,
    //     surname,
    //     dateOfBirth,
    //     pinNumber, // sanitize: convert email to lowercase
    //     panNumber,
    //     ConfirmPinNumber,
    //     isVerified: false
    // });

    // user.save()


    // return res.status(200).json({
    //     message: 'success'
    // });


})

router.post('/login', async (req, res) => {


    const user = await User.findOne({
        pinNumber: req.body.pinNumber,
    });


            const token = jwt.sign(
                { user_pin: user.pinNumber },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token

    if (user) {
        res.status(200).json({
            message: 'login successfull',
            token: token
        })
    }
    else if (user === null) {
        res.status(401).json({
            error: 'enter valid pin'
        })
    }


    // // Our login logic starts here
    // try {
    //     // Get user input
    //     const { pinNumber } = req.body;

    //     // Validate user input
    //     // if (!(pinNumber)) {
    //     //     res.status(400).send("All input is required");
    //     // }
    //     // Validate if user exist in our database
    //     const user = await User.findOne({
    //         pinNumber: req.body.pinNumber,
    //     });


    //     // console.log(user.ConfirmPinNumber);
    //    const conPin = user.ConfirmPinNumber


    //      if (!(pinNumber)) {
    //         res.status(400).send("All input is required");
    //     }

    //     if(pinNumber===conPin){
    //         res.status(400).json({

    //             msg:'login success'

    //         });

    //     }

    //     user.isVerified = true
    //     user.save()






    //     // if (user && (await bcrypt.compare(pinNumber, user.pinNumber))) {
    //     //     // Create token
    //     //     const token = jwt.sign(
    //     //         { user_id: user._id, email },
    //     //         process.env.TOKEN_KEY,
    //     //         {
    //     //             expiresIn: "2h",
    //     //         }
    //     //     );

    //     //     // save user token
    //     //     user.token = token;

    //     //     // user
    //     //     res.status(200).json(user);
    //     // }
    //     // res.status(400).send("Invalid Credentials");
    // } catch (err) {
    //     res.status(400).json({
    //         data:'invalid pin'
    //     });

    // }
})






module.exports = router