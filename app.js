const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const cookieparser = require('cookie-parser')
const account = require('./Routes/account')
const userRoute = require('./Routes/userRoute')
const regOtp = require('./Routes/userRegotp')
const emailVerify = require('./Routes/userEmailregotp')
const DB = 'mongodb+srv://nexusapi:BK8mUvspFNxlUCnG@cluster0.whfcfew.mongodb.net/nexus?retryWrites=true&w=majority'



app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieparser())
app.use(bodyParser.json())



app.use('/user', userRoute)
app.use('/otp',regOtp)
app.use('/email',emailVerify)
app.use('/kite',account)

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
   
}).then(()=>{
    console.log('connection successfullllll');
}).catch((err)=>{
    console.log(err);
});


    module.exports = app