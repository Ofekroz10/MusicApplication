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
exports.auth = exports.secretKey = void 0;
const jwt = require("jsonwebtoken");
const user_1 = require("../mongodb/models/user");
exports.secretKey = 'SecretKey';
exports.auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); // extract the token
        const data = jwt.verify(token, exports.secretKey); //verify and extract the data of the token, we genereted that data contains _id
        const user = yield user_1.Users.findOne({ _id: data._id, 'tokens.token': token });
        if (!user)
            throw new Error('authentication failed');
        req.user = user;
        req.token = token;
        next();
    }
    catch (e) {
        res.status(500).send({ error: e.message });
    }
});
