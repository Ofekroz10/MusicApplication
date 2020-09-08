import express = require('express');
import { User, Users, UserDocument, IUserLogin } from '../mongodb/models/user';
import {auth} from '../middleware/auth'
import {playListUniqName} from '../middleware/playListUniqName' 
import {playListGetByName} from '../middleware/playListGetByName' 
import { Video, VideoDocument, Videos } from '../mongodb/models/video';
import { PlayList,IPlayListDocument,playLists,playListType, playListSchema, basePlayList } from '../mongodb/models/playList';
import {serachByKeyword, doRequest, getCredits} from '../youtubeApi/youtube'
import {CPlayLists, CategoryPlayList, ICPlayListDocument} from './../mongodb/models/categotyPlayList'
import {asyncForEach} from '../Helpers/helper'
import mongoose = require('mongoose')

export const router = express.Router()
declare function emit(k:any, v:any):any;  

/*
    POST:
    /new - Create new playlist according to the user
    /newC - Create new category playlist according to the user

    GET:
    /:pName - Return the playlist by pName(playlist name)
    / - Return all the playlists of the specific user
    /categorySummary - Return the category playlists of the user group by category number
    /extendedSummary - Return all the playlists of the user group by playlist type.
    /summary - Return the count of playlists for each playlist type.


    PUT:
    /:pName/youtube/:keyword?limit=x - Add videos from youtube search results of the keyword. limit = x
    where x is the number of the search results.
    /:pName/add - Add a video to a specific playlist
    /:pName/addSome - Add array of videos to specific playlist

    DELETE:
    /:pName/delete - Delete a specific video from playlist by yId(youtube id of the video)
    /:pName - Delete the specific playlist
*/

router.post('/new',[auth,playListUniqName],async (req:any,res:any)=>{
    try{
        const playList:PlayList = new PlayList(req.user._id,req.body.name);
        const data:IPlayListDocument = await playLists.create(playList);
        await data.save();
        req.user.credits += PlayList.getCredits();
        await req.user.save();
        res.send(data);
    }
    catch(e){
        res.status(400).send({error: e})
    }
})

router.get('/categorySummary',auth,async(req:any,res)=>{
    try{
        let options: mongoose.ModelMapReduceOption<PlayList, number, {Category:number, count:number, Playlists: PlayList[]}> = {
            map: function (this:{category:number}) {
                emit(this.category,this);
            },
            reduce: function (key, values){
                return {Category:key, count:values.length, Playlists: values};
            },
            query: {owner:req.user._id,itemtype:'CategoryPlayList'}

        };

        const results = await basePlayList.mapReduce(options);
        res.send(results);
    }
    catch(e){
        res.status(500).send({error:e.message});
    }
})

router.get('/extendedSummary',auth,async(req:any,res)=>{

    try{

        let options: mongoose.ModelMapReduceOption<PlayList, string, {count:number, Playlists: PlayList[]}> = {
            map: function (this:{itemtype:string}) {
                emit(this.itemtype,this);
            },
            reduce: function (key, values){
                return {count:values.length, Playlists: values};
            },
            query: {owner:req.user._id}

        };

        const results = await playLists.mapReduce(options);
        res.send(results);


    }
    catch(e){
        res.status(500).send(e);
    }
})

router.get('/summary',auth,async(req:any,res)=>{
    try{
        let result:any = {};
        await asyncForEach(playListType,async (x:string)=>{
            result[x] = 0;
            await req.user.populate({
                path:'playLists',
                match:{
                    itemtype:x
                }
            }).execPopulate();
            result[x] = req.user.playLists.length;
        });
        res.send(result);

    }
    catch(e){
        res.status(500).send(e);
    }
})

router.get('/:pName',[auth,playListGetByName],async(req:any,res:any)=>{
    try{
        const playList = req.user.playLists[0];
        if(playList)
        {
            if(req.query.shuffle === 'true')
                return res.send(playList.shuffle());
            return res.send(playList);
        }

        throw new Error(`Cannot find playlist: ${req.params.pName}`);
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
})



router.get('/',auth,async(req:any,res)=>{
    try{
        await req.user.populate('playLists').execPopulate();
        let results = req.user.playLists;
        if(req.query.type){
            //@ts-ignore
            results  = req.user.playLists.filter((x)=>x.itemtype === playListType[req.query.type]);
        }
        res.send({playLists: results});
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
})



router.put('/:pName/add',[auth,playListGetByName],async(req:any,res:any)=>{
    try{
        const playList:IPlayListDocument = req.user.playLists[0];
        const video = new Video(req.body.name,req.body.channelName,req.body.youtubeId,req.body.categoryNum);
        playList.addToList(video);
        await playList.save();
        req.user.credits += Video.getCredits();
        await req.user.save();
        res.send(playList.videos); 
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
})

router.put('/:pName/addSome',[auth,playListGetByName],async(req:any,res:any)=>{
    try{
        const playList:IPlayListDocument = req.user.playLists[0];
        const count = req.body.length;
        req.body.forEach((x:Video)=>{
            const video = new Video(x.name,x.channelName,x.youtubeId,x.categoryNum);
            playList.addToList(video);
        })
        await playList.save();
        req.user.credits += count * Video.getCredits();
        res.send(playList.videos); 
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
})

router.put('/:pName/youtube/:keyword',[auth,playListGetByName],async(req:any,res:any)=>{
    try{
        let limitation = 25;
        if(req.query.limit)
            limitation = (+req.query.limit) +1;

        const results = await serachByKeyword(req.params.keyword,limitation);
        const pName = req.params.pName;
        const data:Video[] = await doRequest(`http://localhost:3000/playList/${pName}/addSome`,'PUT'
        ,results,req.token);
        req.user.credits+= getCredits(limitation);
        await req.user.save();
        res.send(data);
    }
    catch(e){
        res.status(400).send(e)
    }
})




router.delete('/:pName/delete',[auth,playListGetByName],async(req:any,res:any)=>{
    try{
        const playList:IPlayListDocument = req.user.playLists[0];
        const yId = req.body.yId;
        playList.removeFromList(yId);
        await playList.save();
        req.user.credits -= Video.getCredits();
        await req.user.save();
        res.send(playList.videos); 
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
})

router.delete('/:pName',[auth,playListGetByName],async(req:any,res:any)=>{
    try{
        const playList:IPlayListDocument = req.user.playLists[0];
        const count = playList.videos.length;
        await playLists.deleteOne({name:playList.name, owner:req.user._id});
        await req.user.populate('playLists').execPopulate();
        req.user.credits -= (count*Video.getCredits()) + (playList.getCredits());
        await req.user.save();
        res.send(req.user.playLists);
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
})


/* category playlist route */
import { Mongoose } from 'mongoose';
import request = require('request');


router.post('/newC',[auth,playListUniqName],async (req:any,res:any)=>{
    try{
        const playList:CategoryPlayList = new CategoryPlayList(req.user._id,req.body.name);
        const catNum = req.body.category;
        await playList.setCategory(catNum);
        const data:ICPlayListDocument = await CPlayLists.create(playList);
        await data.save();
        req.user.credits += CategoryPlayList.getCredits();
        await req.user.save();
        res.send(data);
    }
    catch(e){
        res.status(400).send({error: e.message})
    }
})



