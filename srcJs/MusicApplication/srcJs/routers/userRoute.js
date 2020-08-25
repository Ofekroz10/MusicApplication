"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require("express");
const user_1 = require("../mongodb/models/user");
exports.router = express.Router();
exports.router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userDetails = req.body;
        let user = yield user_1.Users.findByEmailPassLogin(userDetails.email, userDetails.password);
        res.send(user.toResponse());
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
exports.router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.User(req.body);
        let data = yield user_1.Users.create(user);
        yield data.save();
        res.send(Object.assign({ _id: data._id }, data.toResponse()));
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
