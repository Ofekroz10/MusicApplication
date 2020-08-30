import { Users, UserDocument } from '../mongodb/models/user';
import { PlayList } from '../mongodb/models/playList';

export const playListUniqName =  async (req:any,res:any,next:any):Promise<void>=>{
    try{
        await req.user.populate('playLists').execPopulate();
        const playLists = req.user.playLists;
        const isExist = playLists.every((x:PlayList) => x.name !== req.body.name);
        if(!isExist)
            throw new Error('name already exists');
        req.playLists = playLists;
        next();
    }
    catch(e){
        res.status(500).send({error:e.message})
    }
}