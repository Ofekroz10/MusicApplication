"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_1 = require("./youtube");
youtube_1.getTupleCat().then((data) => console.log(data));
youtube_1.serachByKeyword('dennis+loyd').then((data) => {
    console.log(data);
}).catch((e) => {
    console.log(e);
});
