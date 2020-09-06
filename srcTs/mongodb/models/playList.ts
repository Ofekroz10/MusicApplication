import { Document, Schema, model, Model } from 'mongoose'
import {Video} from './video'
import mongoose = require('mongoose')

/*
    PlayList class: represents a playlist document:
    name:string - the name of the playlist, should be uniqe.
    videos:Video[]; - the videos array of this playlist.
    owner:Schema.Types.ObjectId - the id of the playlist owner. ( a user )

    Methods:
    shuffle- return an array of videos in a random order.
    addTolist- add the video to the playlist, throws 'video already in the playlist' if the video already
    in the playlist.
    removeFromList- remove a video from playlist.

*/
export const playListType:string[] = ['PlayList','CategoryPlayList'];
export class PlayList{
    name:string;
    videos:Video[];
    owner:Schema.Types.ObjectId;

    constructor(owner:Schema.Types.ObjectId, name:string){
        this.owner = owner;
        this.videos = [];
        this.name =name;
    }

    shuffle():Video[]{ // shuffle the playlist O(n) time complexity, O(n) space complexity
        let arr:Video[] = [...this.videos];
        let index = arr.length-1;
        while(index > 0){
            let choosenI = Math.floor(Math.random() * index); // random number [0,index]
            // swap choosenI and index
            const item = arr[index];
            arr[index] = arr[choosenI];
            arr[choosenI] = item;
            index--;
        }
        return arr;
    }

    addToList(video:Video):void{
        const dontContain = this.videos.every((x:Video)=>x.youtubeId !==video.youtubeId)
        if(dontContain)
            this.videos.push(video)
        else
            throw new Error(`video ${video.name} already in the playlist`)
    }

    removeFromList(yId:string):void{
        const filterArray = this.videos.filter((x:Video)=>x.youtubeId !== yId)
        this.videos = filterArray;
    }

}

export const basicPlayListOptions = {
    discriminatorKey: 'itemtype',
    collection:'PlayList'
}

export const playListSchema = new Schema({
    
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
},basicPlayListOptions);



playListSchema.method('addToList',PlayList.prototype.addToList);
playListSchema.method('removeFromList',PlayList.prototype.removeFromList);
playListSchema.method('shuffle',PlayList.prototype.shuffle);

export interface IPlayListDocument extends Document, PlayList{}

/* Base model for extends it */ 
export const basePlayList = mongoose.model<IPlayListDocument>('PlayListBase',playListSchema);


const playListsModel = basePlayList.discriminator<IPlayListDocument>('PlayList',new mongoose.Schema({
}));

/* PlayLists model */
export const playLists = model<IPlayListDocument>('PlayList');

