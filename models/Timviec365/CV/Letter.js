//thư
const mongoose = require('mongoose');
const LetterSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
    },
    name_sub: {
        type: String
    },
    alias: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    colors: {
        type: String
    },
    view: {
        type: Number
    },
    love: {
        type: Number
    },
    download: {
        type: Number
    },
    vip: {
        type: Number
    },
    html_vi: {
        type: String
    },
    html_en: {
        type: String
    },
    html_jp: {
        type: String
    },
    html_cn: {
        type: String
    },
    html_kr: {
        type: String
    },
    cate_id: {
        type: Number
    },
    exp: {
        type: Number
    },
    nhucau: {
        type: Number
    },
    status: {
        type: Number
    }

}, {
    collection: 'Letter',
    versionKey: false
})

module.exports = mongoose.model('Letter', LetterSchema);