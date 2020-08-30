import { Video, VideoDocument, Videos } from '../mongodb/models/video';
import express = require('express');
import {serachByKeyword, getTupleCat} from '../youtubeApi/youtube'

export const router = express.Router()
router.get('/search/:keyword', async (req,res)=>{
    try{
        const data:Video[]  = await serachByKeyword(req.params.keyword);
        res.send(data);
    }
    catch(e){
        res.status(400).send({error:e.message});
    }
})

router.get('/categories', async (req,res)=>{
    try{
        const data:[number,string]  = await getTupleCat();
        res.send(data);
    }
    catch(e){
        res.status(400).send({error:e.message});
    }
})