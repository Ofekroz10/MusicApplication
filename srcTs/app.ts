import express = require('express');
require('./mongodb/mongoose') // for connect to mongodb
import userRouter = require('./routers/userRoute')
import videosRouter = require('./routers/videoRoute')
import playListRouter = require('./routers/playListRoute')
import youtubeRouter = require('./routers/youtubeApiRoute')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) //middleware for converting body to JSON

app.use('/users',userRouter.router)
app.use('/videos',videosRouter.router)
app.use('/playList',playListRouter.router)
app.use('/youtube',youtubeRouter.router);

app.get('/',(req,res)=>{
    res.send('Hi') 
})

app.listen(port, ():void=>{
    console.log('listening 3000')
})