"use strict";
/*
    This middleware put in req.user.playlists the current playlist accoridng to req.body.pName
    (The name of the playlist), if pName dont exist in the playlist collection of the specific user
    throw `Cannot find playlist: ${req.params.pName}`
*/
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
exports.playListGetByName = void 0;
exports.playListGetByName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.user.populate({
            path: 'playLists',
            match: {
                name: req.params.pName
            }
        }).execPopulate();
        const playList = req.user.playLists;
        if (playList.length > 0)
            return next();
        throw new Error(`Cannot find playlist: ${req.params.pName}`);
    }
    catch (e) {
        res.status(404).send({ error: e.message });
    }
});
