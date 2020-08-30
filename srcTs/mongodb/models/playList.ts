import { Document, Schema, model, Model } from 'mongoose'
import {Video} from './video'
import mongoose = require('mongoose')


export class PlayList{
    name:string;
    videos:Video[];
    owner:Schema.Types.ObjectId;

    constructor(owner:Schema.Types.ObjectId, name:string){
        this.owner = owner;
        this.videos = [];
        this.name =name;
    }

    shuffle():Schema.Types.ObjectId[]{
        return [];
    }

    addToList(video:Video):void{
        const dontContain = this.videos.every((x:Video)=>x.youtubeId !==video.youtubeId)
        console.log(dontContain)
        if(dontContain)
            this.videos.push(video)
        else
            throw new Error('video already in the playlist')
    }

    removeFromList(yId:string):void{
        const filterArray = this.videos.filter((x:Video)=>x.youtubeId !== yId)
        this.videos = filterArray;
    }

}

const playListSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    
    videos:[{
        name:String,
        channelName:String,
        youtubeId:String,
        categoryNum:Number
    }],

    owner:{
        type:mongoose.Types.ObjectId
    }
})

playListSchema.method('addToList',PlayList.prototype.addToList);
playListSchema.method('removeFromList',PlayList.prototype.removeFromList);

export interface IPlayListDocument extends Document, PlayList{}

export const PlayLists = model<IPlayListDocument>('PlayList',playListSchema);

