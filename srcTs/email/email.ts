import { User } from "../mongodb/models/user";

const sgMail = require('@sendgrid/mail');

const key = '';

sgMail.setApiKey(key);

export const sendCreditsEmail = (to:string, name:string, credits:number):void =>{
    const msg = {
        to: to,
        from: 'ofekrozenkrantz1@gmail.com',
        subject: 'PlayTube- credits',
        text: `Hi ${name}, \n congratulation you achieve ${credits} credits! \n PlayTube team`
      };

    sgMail.send(msg);
}


