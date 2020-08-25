import express = require('express');
import { User, Users, UserDocument, IUserLogin } from '../mongodb/models/user';
import {auth} from '../middleware/auth'
import { upload } from '../mongodb/multerSettings'

export const router = express.Router()


router.get('/me',auth,(req:any,res)=>{
    res.send(req.user.toResponse());
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
        const allowToEdit = ['password', 'name', 'avatar', 'email'];
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
        let data:UserDocument = await Users.create(user);
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
