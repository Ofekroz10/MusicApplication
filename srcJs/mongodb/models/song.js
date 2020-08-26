"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Songs = exports.SongCat = void 0;
const mongoose_1 = require("mongoose");
var SongCat;
(function (SongCat) {
    SongCat[SongCat["NONE"] = 0] = "NONE";
    SongCat[SongCat["OTHER"] = 1] = "OTHER";
})(SongCat = exports.SongCat || (exports.SongCat = {}));
const songSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    youtubeId: {
        type: String,
        required: true,
        validator(data) {
            if (!data.match(/^(http:|https:)\/\/(www.youtube.com)\/(watch)\?([a-z]|[A-Z])/))
                throw new Error('url invalid');
        }
    },
    category: {
        type: String,
        enum: Object.keys(SongCat),
        default: SongCat.NONE
    }
});
exports.Songs = mongoose_1.model('Song', songSchema);
