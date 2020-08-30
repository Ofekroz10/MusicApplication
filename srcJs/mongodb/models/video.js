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
exports.Videos = exports.Video = void 0;
const mongoose_1 = require("mongoose");
const youtube_1 = require("../../youtubeApi/youtube");
class Video {
    constructor(name, channelName, youtubeId, categoryNum) {
        this.name = name;
        this.channelName = channelName;
        this.youtubeId = youtubeId;
        this.categoryNum = categoryNum;
    }
    equalsVid(other) {
        return this.youtubeId === other.youtubeId;
    }
}
exports.Video = Video;
const videoSchema = new mongoose_1.Schema({
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
    categoryNum: {
        type: Number,
        validation(data) {
            return __awaiter(this, void 0, void 0, function* () {
                const categories = yield youtube_1.getCat();
                if (!categories.includes(data))
                    return new Error('invalid category');
            });
        }
    }
});
exports.Videos = mongoose_1.model('Video', videoSchema);
