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
exports.playListUniqName = void 0;
/*
    This middleware check if req.body.name (the name of the new playlist) not in user's playlist
    collection. It throws `name already exists` error.
*/
exports.playListUniqName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.user.populate('playLists').execPopulate();
        const playLists = req.user.playLists;
        const isExist = playLists.every((x) => x.name !== req.body.name);
        if (!isExist)
            throw new Error('name already exists');
        req.playLists = playLists;
        next();
    }
    catch (e) {
        res.status(500).send({ error: e.message });
    }
});
