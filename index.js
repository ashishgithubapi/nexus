require('dotenv/config');
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv/config');


const app = require('./app');

const port = process.env.PORT || 4020
const DB = 'mongodb+srv://nexusapi:BK8mUvspFNxlUCnG@cluster0.whfcfew.mongodb.net/nexus?retryWrites=true&w=majority'

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
   
}).then(()=>{
    console.log('connection successfullllll');
}).catch((err)=>{
    console.log(err);
});


    app.use(cors());

    app.listen(port,()=>{
        console.log(`app running on port ${port}`);
    })
