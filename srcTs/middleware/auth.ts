import jwt = require('jsonwebtoken')
import { Users, UserDocument } from '../mongodb/models/user';

export const secretKey = 'SecretKey'

export const auth = async (req:any,res:any,next:any):Promise<void>=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','') // extract the token
        const data:{_id:string} =  jwt.verify(token, secretKey) as {_id:string}//verify and extract the data of the token, we genereted that data contains _id
        const user = await Users.findOne({_id:data._id,'tokens.token':token})

        if(!user)
            throw new Error('authentication failed');
    
        req.user = user;
        req.token = token;
        next();
    }
    catch(e){
        res.status(500).send({error:e.message})
    }
}