"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const db = 'Music-manager';
mongoose.connect('mongodb://127.0.0.1:27017/' + db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err)
        console.log(err); //connection failed
});
