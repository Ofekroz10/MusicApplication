"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.User = void 0;
const mongoose_1 = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth_1 = require("../../middleware/auth");
class User {
    constructor({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.credits = 0;
        this.avatar = Buffer.from('');
        this.tokens = [];
    }
    /* Only function that dont use _id can be here ... */
    toResponse() {
        return {
            name: this.name,
            email: this.email,
            credits: this.credits,
            avatar: this.avatar
        };
    }
}
exports.User = User;
let schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // valid the email adress by using validatior.js
        validations(data) {
            if (!validator.default.isEmail(data)) {
                throw new Error('email is not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        // valid that password dont contains 'password'
        validations(data) {
            if (data.toLowerCase().includes('password'))
                throw new Error('password cannot contains password');
        }
    },
    credits: {
        type: Number
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
            token: {
                type: String,
                require: true
            }
        }]
});
// register the user method 'toResponse'
schema.method('toResponse', User.prototype.toResponse);
// implemention of method from UserDocument, typeof this here is UserDocumnet
// token contais _id
schema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign({ _id: this._id.toString() }, auth_1.secretKey);
        this.tokens = this.tokens.concat({ token });
        yield this.save();
        return token;
    });
};
schema.statics.findByEmailPassLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield exports.Users.findOne({ email });
    if (!user)
        throw new Error('login failed- email not exist');
    console.log(user);
    let match = yield bcrypt.compare(password, user.password);
    console.log(match);
    if (!match)
        throw new Error('login failed password');
    return user;
});
//middleware for hashing the password
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield bcrypt.hash(this.password, 8);
        }
        next();
    });
});
//now we can use User functions, because model will return UserDocument and not Document
// and the schema is typeof IUserModel so static method of schema should be in IUserModel
exports.Users = mongoose_1.model('User', schema);
