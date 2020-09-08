import {User} from '../mongodb/models/user'
import {checkAndSendEmail} from '../email/sendEmail'
import { initParams } from 'request';

export const credits = async (req:any,res:any,next:any):Promise<void>=>{
    try{
        const user = req.user;
        if(user.credits < User.CreaditsToEmail)
            req.toEmail = true;
        next();
    }
    catch(e){
        res.status(500).send({error:e.message})
    }
}