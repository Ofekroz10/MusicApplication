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
const youtube_1 = require("../youtubeApi/youtube");
const helper_1 = require("../Helpers/helper");
exports.router = express.Router();
/*
    POST:
    /new - Create new playlist according to the user

    GET:
    /:pName - Return the playlist by pName(playlist name)
    / - Return all the playlists of the specific user

    PUT:
    /:pName/add - Add a video to a specific playlist
    /:pName/addSome - Add array of videos to specific playlist

    DELETE:
    /:pName/delete - Delete a specific video from playlist by yId(youtube id of the video)
    /:pName - Delete the specific playlist
*/
exports.router.post('/new', [auth_1.auth, playListUniqName_1.playListUniqName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = new playList_1.PlayList(req.user._id, req.body.name);
        const data = yield playList_1.playLists.create(playList);
        yield data.save();
        req.user.credits += playList_1.PlayList.getCredits();
        yield req.user.save();
        res.send(data);
    }
    catch (e) {
        res.status(400).send({ error: e });
    }
}));
exports.router.get('/extendedSummary', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {
            map: function () {
                emit(this.itemtype, this);
            },
            reduce: function (key, values) {
                return { count: values.length, Playlists: values };
            },
            query: { owner: req.user._id }
        };
        const results = yield playList_1.playLists.mapReduce(options);
        res.send(results);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.router.get('/summary', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = {};
        yield helper_1.asyncForEach(playList_1.playListType, (x) => __awaiter(void 0, void 0, void 0, function* () {
            result[x] = 0;
            yield req.user.populate({
                path: 'playLists',
                match: {
                    itemtype: x
                }
            }).execPopulate();
            result[x] = req.user.playLists.length;
        }));
        res.send(result);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.router.get('/:pName', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        if (playList) {
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
        let results = req.user.playLists;
        if (req.query.type) {
            //@ts-ignore
            results = req.user.playLists.filter((x) => x.itemtype === playList_1.playListType[req.query.type]);
        }
        res.send({ playLists: results });
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
        req.user.credits += video_1.Video.getCredits();
        yield req.user.save();
        res.send(playList.videos);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.put('/:pName/addSome', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        const count = req.body.length;
        req.body.forEach((x) => {
            const video = new video_1.Video(x.name, x.channelName, x.youtubeId, x.categoryNum);
            playList.addToList(video);
        });
        yield playList.save();
        req.user.credits += count * video_1.Video.getCredits();
        res.send(playList.videos);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.put('/:pName/youtube/:keyword', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let limitation = 25;
        if (req.query.limit)
            limitation = (+req.query.limit) + 1;
        const results = yield youtube_1.serachByKeyword(req.params.keyword, limitation);
        const pName = req.params.pName;
        const data = yield youtube_1.doRequest(`http://localhost:3000/playList/${pName}/addSome`, 'PUT', results, req.token);
        req.user.credits += youtube_1.getCredits(limitation);
        yield req.user.save();
        res.send(data);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
exports.router.delete('/:pName/delete', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        const yId = req.body.yId;
        playList.removeFromList(yId);
        yield playList.save();
        req.user.credits -= video_1.Video.getCredits();
        yield req.user.save();
        res.send(playList.videos);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
exports.router.delete('/:pName', [auth_1.auth, playListGetByName_1.playListGetByName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = req.user.playLists[0];
        const count = playList.videos.length;
        yield playList_1.playLists.deleteOne({ name: playList.name, owner: req.user._id });
        yield req.user.populate('playLists').execPopulate();
        req.user.credits -= (count * video_1.Video.getCredits()) + (playList.getCredits());
        yield req.user.save();
        res.send(req.user.playLists);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
}));
/* category playlist route */
const categotyPlayList_1 = require("./../mongodb/models/categotyPlayList");
exports.router.post('/newC', [auth_1.auth, playListUniqName_1.playListUniqName], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playList = new categotyPlayList_1.CategoryPlayList(req.user._id, req.body.name);
        const catNum = req.body.category;
        yield playList.setCategory(catNum);
        const data = yield categotyPlayList_1.CPlayLists.create(playList);
        yield data.save();
        req.user.credits += categotyPlayList_1.CategoryPlayList.getCredits();
        yield req.user.save();
        res.send(data);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
}));
