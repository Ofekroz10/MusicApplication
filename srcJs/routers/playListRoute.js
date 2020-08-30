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
const auth_1 = require("../middleware/auth");
const playListUniqName_1 = require("../middleware/playListUniqName");
const playListGetByName_1 = require("../middleware/playListGetByName");
const video_1 = require("../mongodb/models/video");
const playList_1 = require("../mongodb/models/playList");
exports.router = express.Router();
/*
    Create new playlist according the user
*/
exports.router.post('/new', [auth_1.auth, playListUniqName_1.playListUniqName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = new playList_1.PlayList(req.user._id, req.body.name);
        const data = yield playList_1.PlayLists.create(playList);
        yield data.save();
        res.send(data);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
}));
exports.router.get('/:pName', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        if (playList) {
            console.log(playList);
            console.log(req.query.shuffle);
            if (req.query.shuffle === 'true')
                return res.send(playList.shuffle());
            return res.send(playList);
        }
        throw new Error(`Cannot find playlist: ${req.params.pName}`);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.user.populate('playLists').execPopulate();
        res.send(req.user.playLists);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.put('/:pName/add', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        const video = new video_1.Video(req.body.name, req.body.channelName, req.body.youtubeId, req.body.categoryNum);
        playList.addToList(video);
        yield playList.save();
        res.send(playList.videos);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.put('/:pName/addSome', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        req.body.forEach((x) => {
            const video = new video_1.Video(x.name, x.channelName, x.youtubeId, x.categoryNum);
            playList.addToList(video);
        });
        yield playList.save();
        res.send(playList.videos);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.delete('/:pName/delete', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        const yId = req.body.yId;
        playList.removeFromList(yId);
        yield playList.save();
        res.send(playList.videos);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
