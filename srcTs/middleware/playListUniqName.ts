import { Users, UserDocument } from '../mongodb/models/user';
import { PlayList } from '../mongodb/models/playList';

/*
    This middleware check if req.body.name (the name of the new playlist) not in user's playlist
    collection. It throws `name already exists` error.
*/

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