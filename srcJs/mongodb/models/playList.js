"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playLists = exports.basePlayList = exports.playListSchema = exports.basicPlayListOptions = exports.PlayList = exports.playListType = void 0;
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
/*
    PlayList class: represents a playlist document:
    name:string - the name of the playlist, should be uniqe.
    videos:Video[]; - the videos array of this playlist.
    owner:Schema.Types.ObjectId - the id of the playlist owner. ( a user )

    Methods:
    shuffle- return an array of videos in a random order.
    addTolist- add the video to the playlist, throws 'video already in the playlist' if the video already
    in the playlist.
    removeFromList- remove a video from playlist.

*/
exports.playListType = ['PlayList', 'CategoryPlayList'];
class PlayList {
    constructor(owner, name) {
        this.owner = owner;
        this.videos = [];
        this.name = name;
    }
    shuffle() {
        let arr = [...this.videos];
        let index = arr.length - 1;
        while (index > 0) {
            let choosenI = Math.floor(Math.random() * index); // random number [0,index]
            // swap choosenI and index
            const item = arr[index];
            arr[index] = arr[choosenI];
            arr[choosenI] = item;
            index--;
        }
        return arr;
    }
    addToList(video) {
        const dontContain = this.videos.every((x) => x.youtubeId !== video.youtubeId);
        if (dontContain)
            this.videos.push(video);
        else
            throw new Error(`video ${video.name} already in the playlist`);
    }
    removeFromList(yId) {
        const filterArray = this.videos.filter((x) => x.youtubeId !== yId);
        this.videos = filterArray;
    }
}
exports.PlayList = PlayList;
exports.basicPlayListOptions = {
    discriminatorKey: 'itemtype',
    collection: 'PlayList'
};
exports.playListSchema = new mongoose_1.Schema({
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
}, exports.basicPlayListOptions);
exports.playListSchema.method('addToList', PlayList.prototype.addToList);
exports.playListSchema.method('removeFromList', PlayList.prototype.removeFromList);
exports.playListSchema.method('shuffle', PlayList.prototype.shuffle);
/* Base model for extends it */
exports.basePlayList = mongoose.model('PlayListBase', exports.playListSchema);
const playListsModel = exports.basePlayList.discriminator('PlayList', new mongoose.Schema({}));
/* PlayLists model */
exports.playLists = mongoose_1.model('PlayList');
