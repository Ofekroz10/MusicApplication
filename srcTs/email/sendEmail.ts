import {User} from '../mongodb/models/user'
import {sendCreditsEmail} from '../email/email'

export const checkAndSendEmail = async (req:any,res:any,next:any):Promise<void>=>{
    try{
        if(req.toEmail && req.user.credits >= User.CreaditsToEmail)
            sendCreditsEmail(req.user.email,req.user.name,User.CreaditsToEmail);
    }
    catch(e){
        res.status(500).send({error:e.message})
    }
}