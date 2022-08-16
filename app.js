const express = require('express');
const app = express();
const dotEnv = require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const cookieparser = require('cookie-parser')
const userRoute = require('./Routes/userRoute')
const regOtp = require('./Routes/userRegotp')
const emailVerify = require('./Routes/userEmailregotp')

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieparser())
app.use(bodyParser.json())


app.use('/user', userRoute)
app.use('/otp',regOtp)
app.use('/email',emailVerify)
const DB = 'mongodb+srv://nexusapi:BK8mUvspFNxlUCnG@cluster0.whfcfew.mongodb.net/nexus?retryWrites=true&w=majority'

// mongoose.connect(process.env.MONGODB_URL_LOCAL,{
//     useNewUrlParser: true,
//     useUnifiedTopology:true,
//     // useCreateIndex:true
// })

// .then(()=>console.log("connected"))
// .catch((err)=>console.log(err))

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
   
}).then(()=>{
    console.log('connection successfullllll');
}).catch((err)=>{
    console.log(err);
});
// mongoose.connect('mongodb://localhost:27017/nexus')
//     .then(() => {
//         console.log("mongodb is started now")
//     }).catch(() => {
//         console.log("mongodb error")
//     })


    module.exports = app