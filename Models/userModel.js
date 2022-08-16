const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:String,
    surname:String,
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    panNumber:String,
    pinToken:String,
    pinNumber:String,
    ConfirmPinNumber:String,
    isVerified:Boolean
    
})

module.exports = mongoose.model('user',userSchema)