import express = require('express');
import { User, Users, UserDocument, IUserLogin,limitedUser } from '../mongodb/models/user';
import {auth} from '../middleware/auth'
import { upload } from '../mongodb/multerSettings'

/*
    This class represents the user routes.

    Get:
    ------------------------------------------
    /me - return details on specific user (by id from the jwt token) as IUserOutput (see models/user.ts)

    Post:
    ------------------------------------------
    /login - for login a user. the body should be as IUserLogin form (see models/user.ts) 
    /logout - for logout a specific user from specific connection using the jwt token.
    /me/avatar - for set an image for specific user. the image should pass the multerSettings middleware.
    / - for post a new user. the body should be as IUserInput form.

    Patch:
    ------------------------------------------
    /me - for edit the details of specific user. the body should contains only keys from this list:
    ['password', 'name', 'email'] other properties are immutable.

*/


export const router = express.Router()


router.get('/me',auth,(req:any,res)=>{
    res.send(req.user.toResponse());
})

router.get('/credits',auth,async (req:any,res)=>{
    const data = await Users.find({}, limitedUser,{sort:{credits:1}}); // sort by credits
    res.send(data);
})


router.post('/login',async(req,res)=>{
    try{
        const userDetails:IUserLogin = req.body;
        const user = await Users.findByEmailPassLogin(userDetails.email,userDetails.password);
        const token = await user.generateAuthToken();
        const userObj = user.toResponse();
        res.send({userObj,token});
    }
    catch(e){
        console.log(e)
        res.status(400).send(e);
    }

})

router.post('/logout',auth ,async(req:any,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((x:{token:string})=>x.token!==req.token)
        await req.user.save()
        return res.status(200).send({message: 'log out succseed'})
    }
    catch(e){
        res.status(500).send({error: e})
    }
})

router.patch('/me',auth,async(req:any,res)=>{
    try{
        const allowToEdit = ['password', 'name', 'email'];
        const toEdit = Object.keys(req.body);
        const canEdit = toEdit.every((x:string)=>allowToEdit.includes(x));
        if(!canEdit)
            throw new Error('one or more params are invalid')
        toEdit.forEach((x:string)=>{
            req.user[x] = req.body[x];
        })

        const user = await req.user.save();
        res.send(user.toResponse());
        
    }
    catch(e){
        res.status(400).send({error:e.message})
    }
})




/* put the file in form-data key=avatar */

router.post('/me/avatar',auth,upload.single('avatar'),async(req:any,res:any)=>{
    if(req.file){
        req.user.avatar = req.file.buffer;
        await req.user.save();
        return res.send('Upload completed!')
    }
   res.status(400).send({error:'please upload a file'})
},(error:any,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.status(400).send({error: error.message});
})

router.post('/',async(req,res)=>{
    try{
        const user = new User(req.body);
        const data:UserDocument = await Users.create(user);
        await data.save();
        res.send({
            _id:data._id,
            ...data.toResponse()
        });
        
    }
    catch(e){
        res.status(400).send(e)
    }
})
