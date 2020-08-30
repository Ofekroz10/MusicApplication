"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayLists = exports.PlayList = void 0;
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
class PlayList {
    constructor(owner, name) {
        this.owner = owner;
        this.videos = [];
        this.name = name;
    }
    shuffle() {
        return [];
    }
    addToList(video) {
        const dontContain = this.videos.every((x) => x.youtubeId !== video.youtubeId);
        console.log(dontContain);
        if (dontContain)
            this.videos.push(video);
        else
            throw new Error('video already in the playlist');
    }
    removeFromList(yId) {
        const filterArray = this.videos.filter((x) => x.youtubeId !== yId);
        this.videos = filterArray;
    }
}
exports.PlayList = PlayList;
const playListSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    videos: [{
            name: String,
            channelName: String,
            youtubeId: String,
            categoryNum: Number
        }],
    owner: {
        type: mongoose.Types.ObjectId
    }
});
playListSchema.method('addToList', PlayList.prototype.addToList);
playListSchema.method('removeFromList', PlayList.prototype.removeFromList);
exports.PlayLists = mongoose_1.model('PlayList', playListSchema);
