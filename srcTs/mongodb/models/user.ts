import { Document, Schema, model, Model } from 'mongoose'
import validator = require('validator')
import bcrypt = require('bcryptjs')
import express = require('express')
import jwt = require('jsonwebtoken')
import {secretKey} from '../../middleware/auth'

/*
    This file contains:
    -------------------------------------------------
    User class: to represents an user by class.
    User schema: schema for user, based on user class. 
    -------------------------------------------------
    IUserModel- an interface for user model.
    IUserLogin- an interface for declare the expected input for login.
    IUserLogin- an interface for declare the expected input for create new user.
    UserDocument- an interface that inheritance from Document(in mongoose) & User class, 
    declare the type of each document in users collection.
    -------------------------------------------------
    findByEmailPassLogin- a function for validate login of user, throws error if email dont exist,
    or password dont match, else return the user by return UserDocument object.
*/


// static method of user schema should be here
export interface IUserModel extends Model<UserDocument>{
    findByEmailPassLogin(email:string,password:string):Promise<UserDocument>
}

export interface IUserLogin{
    email:string;
    password:string;
}

export interface IUserInput{
    name:string;
    email:string;
    password:string;
}

export interface IUserOutput{
    name:string;
    email:string;
    credits:number;
    avatar:Buffer;
}


export class User{
    name:string;
    email:string;
    password:string;
    credits:number;
    avatar:Buffer;
    tokens:{token:string}[]

    constructor({name,email,password}:IUserInput){
        this.name = name;
        this.email = email;
        this.password = password;
        this.credits = 0;
        this.avatar = Buffer.from('');
        this.tokens = [];
    }

    /* Only function that dont use _id can be here ... */
    toResponse():IUserOutput{
        return{
            name:this.name,
            email:this.email,
            credits:this.credits,
            avatar:this.avatar
        }
    }

}

let schema = new Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique:true,

        // valid the email adress by using validatior.js
        validations(data:string):void{
            if(!validator.default.isEmail(data)){
                throw new Error('email is not valid')
            }
        }
    },

    password:{
        type: String,
        required: true,
        minlength:6,
        trim:true,
        
        // valid that password dont contains 'password'
        validations(data:string):void{
            if(data.toLowerCase().includes('password'))
                throw new Error('password cannot contains password')
        }
    },

    credits:{
        type:Number
    },

    avatar:{
        type:Buffer
    },

    tokens:[{
        token:{
            type:String,
            require: true
        }
    }]
})

// register the user method 'toResponse'
schema.method('toResponse',User.prototype.toResponse)

// implemention of method from UserDocument, typeof this here is UserDocumnet
// token contais _id
schema.methods.generateAuthToken = async function(this:UserDocument):Promise<string>{
    const token = jwt.sign({_id:this._id.toString()},secretKey);
    this.tokens = this.tokens.concat({token});
    await this.save()

    return token;
}
schema.statics.findByEmailPassLogin = async(email:string, password:string):Promise<UserDocument>=>{
    let user = await Users.findOne({email});
    if(!user)
        throw new Error('login failed- email not exist');
    console.log(user)
    let match = await bcrypt.compare(password,user.password);
    console.log(match)
    if(!match)
        throw new Error('login failed password');
    return user;
    
}

//middleware for hashing the password
schema.pre('save', async function(this:UserDocument,next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

// for allowing use User & Document properties/methods, declare here method that use _id 
export interface UserDocument extends User, Document {
     generateAuthToken():Promise<string>
}

//now we can use User functions, because model will return UserDocument and not Document
// and the schema is typeof IUserModel so static method of schema should be in IUserModel
export const Users = model<UserDocument,IUserModel>('User',schema)

