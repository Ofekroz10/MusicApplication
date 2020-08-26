import { Document, Schema, model, Model } from 'mongoose'
import {getCat} from '../../youtubeApi/youtube'


export interface Video{
    name:string;
    channelName:string;
    youtubeId:string;
    categoryNum:number;
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

export interface SongDocument extends Document,Video {}

export const Songs = model<SongDocument>('Video',videoSchema);



