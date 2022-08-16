const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose. Schema({
    email:{
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],

        required: true
    },
}, {timestamps: true});

userSchema.methods.generateJWT = function(){
    const token = jwt.sign({
        _id: this._id,
        number:this.number
    }, process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
}

module.exports = mongoose.model('Email',userSchema)