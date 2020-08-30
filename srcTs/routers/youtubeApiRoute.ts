import { Video, VideoDocument, Videos } from '../mongodb/models/video';
import express = require('express');
import {serachByKeyword, getTupleCat} from '../youtubeApi/youtube'

export const router = express.Router()

/*
    GET:
    /search/:keyword - Return the search results of the keyword as Video object, limitation the number 
    of the results is 25 by default. The user can provide another limitaion using query param: limit
    /categories - Return list of tuples: [Category:number, Value:string]
*/

router.get('/search/:keyword', async (req,res)=>{
    try{
        let limitation = 25; // Default limition
        if(req.query.limit)
            limitation = (+req.query.limit) + 1;
        const data:Video[]  = await serachByKeyword(req.params.keyword,limitation);
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