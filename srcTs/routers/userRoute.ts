import express = require('express');
import { User, Users, UserDocument, IUserLogin } from '../mongodb/models/user';

export const router = express.Router()

router.post('/login',async(req,res)=>{
    try{
        let userDetails:IUserLogin = req.body;
        let user = await Users.findByEmailPassLogin(userDetails.email,userDetails.password);
        res.send(user.toResponse())
    }
    catch(e){
        console.log(e)
        res.status(400).send(e);
    }

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
