"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
require('./mongodb/mongoose'); // for connect to mongodb
const userRouter = require("./routers/userRoute");
const videosRouter = require("./routers/videoRoute");
const playListRouter = require("./routers/playListRoute");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); //middleware for converting body to JSON
app.use('/users', userRouter.router);
app.use('/videos', videosRouter.router);
app.use('/playList', playListRouter.router);
app.get('/', (req, res) => {
    res.send('Hi');
});
app.listen(port, () => {
    console.log('listening 3000');
});
