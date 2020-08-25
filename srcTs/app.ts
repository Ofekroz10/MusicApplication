import express = require('express');
require('./mongodb/mongoose') // for connect to mongodb
import userRouter = require('./routers/userRoute')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) //middleware for converting body to JSON
app.use('/users',userRouter.router)


app.get('/',(req,res)=>{
    res.send('Hi') 
})

app.listen(port, ():void=>{
    console.log('listening 3000')
})