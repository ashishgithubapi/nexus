const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose. Schema({
    phone:{
        type: String,
        match: /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g
        ,
        required: true
    },
}, {timestamps: true});

userSchema.methods.generateJWT = function(){
    const token = jwt.sign({
        _id: this._id,
        number:this.number
    }, process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
}

module.exports = mongoose.model('OTP',userSchema)