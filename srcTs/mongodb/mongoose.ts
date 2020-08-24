import mongoose = require('mongoose')
import { MongoError } from 'mongodb'
const db = 'Music-manager'

mongoose.connect('mongodb://127.0.0.1:27017/'+db,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
},(err:MongoError):void=>{
    if(err)
        console.log(err) //connection failed
})

