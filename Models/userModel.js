const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:String,
    surname:String,
    dateOfBirth: { type: String, default: Date } ,
    panNumber:String,
    pinToken:String,
    pinNumber:String,
    ConfirmPinNumber:String,
    isVerified:Boolean
    
})

module.exports = mongoose.model('user',userSchema)