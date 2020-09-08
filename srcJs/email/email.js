"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCreditsEmail = void 0;
const sgMail = require('@sendgrid/mail');
const key = '';
sgMail.setApiKey(key);
exports.sendCreditsEmail = (to, name, credits) => {
    const msg = {
        to: to,
        from: 'ofekrozenkrantz1@gmail.com',
        subject: 'PlayTube- credits',
        text: `Hi ${name}, \n congratulation you achieve ${credits} credits! \n PlayTube team`
    };
    sgMail.send(msg);
};
