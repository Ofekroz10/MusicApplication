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
exports.CPlayLists = exports.CategoryPlayList = void 0;
const mongoose_1 = require("mongoose");
const playList_1 = require("./playList");
const youtube_1 = require("../../youtubeApi/youtube");
class CategoryPlayList extends playList_1.PlayList {
    constructor(owner, name) {
        super(owner, name);
        this.category = -1;
    }
    setCategory(cat) {
        return __awaiter(this, void 0, void 0, function* () {
            const isOk = yield this.validCat(cat);
            if (!isOk)
                throw new Error(`category ${cat} is not valid`);
            this.category = cat;
            return;
        });
    }
    addToList(video) {
        if (this.category == -1)
            throw new Error(`category ${this.category} is not valid`);
        if (video.categoryNum != this.category)
            throw new Error(`cannot add video with category ${video.categoryNum} to playlist with category ${this.category}`);
        super.addToList(video);
    }
    validCat(catNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const catTuple = yield youtube_1.doRequest('http://localhost:3000/youtube/categories');
            const isCat = catTuple.find(x => x[0] === catNumber);
            return isCat !== undefined;
        });
    }
}
exports.CategoryPlayList = CategoryPlayList;
const categorySchema = new mongoose_1.Schema({
    category: {
        type: Number,
        required: true
    }
});
categorySchema.method('addToList', CategoryPlayList.prototype.addToList);
const CategoriesPlayListModel = playList_1.basePlayList.discriminator('CategoryPlayList', categorySchema);
exports.CPlayLists = mongoose_1.model('CategoryPlayList');
