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
exports.router = void 0;
const express = require("express");
const user_1 = require("../mongodb/models/user");
const auth_1 = require("../middleware/auth");
exports.router = express.Router();
exports.router.get('/me', auth_1.auth, (req, res) => {
    res.send(req.user.toResponse());
});
exports.router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = req.body;
        const user = yield user_1.Users.findByEmailPassLogin(userDetails.email, userDetails.password);
        const token = yield user.generateAuthToken();
        const userObj = user.toResponse();
        res.send({ userObj, token });
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
exports.router.post('/logout', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = req.user.tokens.filter((x) => x.token !== req.token);
        yield req.user.save();
        return res.status(200).send({ message: 'log out succseed' });
    }
    catch (e) {
        res.status(500).send({ error: e });
    }
}));
exports.router.patch('/me', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allowToEdit = ['password', 'name', 'avatar', 'email'];
        const toEdit = Object.keys(req.body);
        const canEdit = toEdit.every((x) => allowToEdit.includes(x));
        if (!canEdit)
            throw new Error('one or more params are invalid');
        toEdit.forEach((x) => {
            req.user[x] = req.body[x];
        });
        const user = yield req.user.save();
        res.send(user.toResponse());
    }
    catch (e) {
        res.status(400).send({ error: e.message });
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
