import { Document, Schema, model, Model } from 'mongoose'
import {Video} from './video'
import mongoose = require('mongoose')
import { PlayList, playLists, basePlayList } from './playList'
import { doRequest } from '../../youtubeApi/youtube'



export class CategoryPlayList extends PlayList{

    category:number;

    constructor(owner:Schema.Types.ObjectId, name:string){
        super(owner,name);
        this.category = -1;
    }

    async setCategory(cat:number){
       const isOk = await this.validCat(cat);
       if(!isOk)
            throw new Error(`category ${cat} is not valid`);
       this.category = cat;
       return;
    }

    addToList(video:Video):void{
        if(this.category == -1)
            throw new Error(`category ${this.category} is not valid`);
        if(video.categoryNum != this.category)
            throw new Error(`cannot add video with category ${video.categoryNum} to playlist with category ${this.category}`);
        super.addToList(video);   
    }

    private async validCat(catNumber:number):Promise<boolean>{
        const catTuple:[[number,string]]  = await doRequest('http://localhost:3000/youtube/categories');
        const isCat = catTuple.find(x => x[0] === catNumber);
        return isCat !== undefined;
    }
}

export interface ICPlayListDocument extends Document, CategoryPlayList{}

const categorySchema = new Schema({
    category:{
        type:Number,
        required:true
    }
})

categorySchema.method('addToList',CategoryPlayList.prototype.addToList);

const CategoriesPlayListModel =  basePlayList.discriminator<ICPlayListDocument>
('CategoryPlayList',categorySchema);

export const CPlayLists = model<ICPlayListDocument>('CategoryPlayList');






