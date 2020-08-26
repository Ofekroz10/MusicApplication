"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer = require("multer");
/*
    An instance of multer, which config this settings:
    1. limit the file size to 1MB
    2. filter the files: accepts only .jpg, .jpeg, .png files

*/
exports.upload = multer({
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('please use [.jpg,.jpeg,.png] file'));
        }
        cb(null, true);
    }
});
