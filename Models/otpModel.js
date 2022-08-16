// const {Schema,model} = require('mongoose');

// module.exports.Otp = model('Otp',Schema({
//     Phone:{
//         type: Number,
//         required:true
//     },
//     otp: {
//         type: String,
//         required:true
//     },

//     createdAt:{type:Date, default: Date.now}
// },{timestamps:true}))

const mongoose = require('mongoose');


const userSchema = new mongoose. Schema({
    phone:{
        type: String,
        required: true
    },
    otp:{
        type:String,
        required:true

    }
}, {timestamps: true});



module.exports = mongoose.model('VOTP',userSchema)