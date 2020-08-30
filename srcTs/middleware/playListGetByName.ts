
export const playListGetByName =  async (req:any,res:any,next:any):Promise<void>=>{
    try{
        await req.user.populate({
            path:'playLists',
            match:{
                name:req.params.pName
            }
        }).execPopulate();

        const playList = req.user.playLists;
        if(playList)
            return next();

        throw new Error(`Cannot find playlist: ${req.params.pName}`);
    }
    catch(e){
        res.status(404).send({error:e.message});
    }
}