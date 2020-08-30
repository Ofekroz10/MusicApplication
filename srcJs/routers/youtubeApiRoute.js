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
const youtube_1 = require("../youtubeApi/youtube");
exports.router = express.Router();
/*
    GET:
    /search/:keyword - Return the search results of the keyword as Video object, limitation the number
    of the results is 25 by default. The user can provide another limitaion using query param: limit
    /categories - Return list of tuples: [Category:number, Value:string]
*/
exports.router.get('/search/:keyword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let limitation = 25; // Default limition
        if (req.query.limit)
            limitation = (+req.query.limit) + 1;
        const data = yield youtube_1.serachByKeyword(req.params.keyword, limitation);
        res.send(data);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
}));
exports.router.get('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield youtube_1.getTupleCat();
        res.send(data);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
}));
