import express = require('express');
import { User, Users, UserDocument, IUserLogin } from '../mongodb/models/user';
import {auth} from '../middleware/auth'
import { Video, VideoDocument, Videos } from '../mongodb/models/video';

export const router = express.Router()

router.post('/',async (req,res)=>{
    try{
        const video:Video = req.body;
        const data:VideoDocument = await Videos.create(video);
        await data.save();
        res.send(data);
        
    }
    catch(e){
        res.status(400).send(e)
    }
})