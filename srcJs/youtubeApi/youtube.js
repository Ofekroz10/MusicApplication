"use strict";
/*
    For search by keyword use:
    GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=dennis+lloyd&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk
    where q is the keyword
    Result: for extract the id of the video check if Result.id.videoId exists then take it.
    the link is: https://www.youtube.com/watch?v={{videoID}}

    For get details about a video use:
    GET https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id={{videoID}}&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk

    For get all categories: https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk

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
exports.getCat = exports.getTupleCat = exports.serachByKeyword = exports.doRequest = exports.getCredits = void 0;
const request = require("request");
const video_1 = require("../mongodb/models/video");
/*
    This method make request to support async & await
    by creating a promise for every request
*/
exports.getCredits = (numOfVideo) => video_1.Video.getCredits() * 0.5 * numOfVideo;
function doRequest(url, method = 'GET', body = {}, token = '') {
    const headers = {
        "Authorization": "Bearer " + token,
        "Content-type": "application/json"
    };
    if (method !== 'GET') {
        return new Promise(function (resolve, reject) {
            console.log(body, method);
            body = JSON.stringify(body);
            request({ url: url, method: method, body: body, headers: headers }, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(JSON.parse(body));
                }
                else {
                    reject(JSON.parse(res.body));
                }
            });
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            request(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(JSON.parse(body));
                }
                else {
                    reject(JSON.parse(res.body));
                }
            });
        });
    }
}
exports.doRequest = doRequest;
const getCategory = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=AIzaSyDuPHqMcc-PHrawcg8QnDFx1fTsU5nbMr4`;
    const data = yield doRequest(url);
    return data.items[0].snippet.categoryId;
});
const toSong = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = new video_1.Video(res.snippet.title, res.snippet.channelTitle, res.id.videoId, yield getCategory(res.id.videoId));
    return obj;
});
exports.serachByKeyword = (keyword, limitation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limitation}&q=${keyword}&key=AIzaSyDuPHqMcc-PHrawcg8QnDFx1fTsU5nbMr4`;
        let data = yield doRequest(url);
        data = data.items.filter((x) => x.id.videoId);
        let songs = [];
        for (let song of data) {
            const asSong = yield toSong(song);
            songs.push(asSong);
        }
        return songs;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.getTupleCat = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyDuPHqMcc-PHrawcg8QnDFx1fTsU5nbMr4';
    let data = yield doRequest(url);
    data = data.items.map((x) => {
        return [+x.id, x.snippet.title];
    });
    return data;
});
exports.getCat = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyDuPHqMcc-PHrawcg8QnDFx1fTsU5nbMr4';
    let data = yield doRequest(url);
    data = data.items.map((x) => {
        return (+x.id);
    });
    return data;
});
