import { Document, Schema, model, Model } from 'mongoose'
import {getCat} from '../../youtubeApi/youtube'
import { Z_ASCII } from 'zlib';


export class Video{
    name:string;
    channelName:string;
    youtubeId:string;
    categoryNum:number;

    public static getCredits():number{return 5;}

   constructor(name:string,channelName:string,youtubeId:string, categoryNum:number){
       this.name = name;
       this.channelName = channelName;
       this.youtubeId = youtubeId;
       this.categoryNum = categoryNum;
   }

   equalsVid(other:Video){
       return this.youtubeId === other.youtubeId;
   }
}

const videoSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    channelName:{
        type:String,
        required: true
    },
    youtubeId:{
        type:String,
        required: true,
        validator(data:string){
            if(!data.match(/^(http:|https:)\/\/(www.youtube.com)\/(watch)\?([a-z]|[A-Z])/))
                throw new Error('url invalid');
        }
    },
    categoryNum:{
        type:Number,
        async validation(data:number){
            const categories = await getCat();
            if(!categories.includes(data))
                return new Error('invalid category')
        }
        
    }
})

export interface VideoDocument extends Document,Video {}

export const Videos = model<VideoDocument>('Video',videoSchema);
