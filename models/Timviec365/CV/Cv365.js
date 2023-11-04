//cv
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Cv365Schema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
    },
    alias: {
        type: String,
    },
    url_alias: {
        type: String,
    },
    url_canonical: {
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
        type: Number,
        default: 0
    },
    love: {
        type: Number
    },
    download: {
        type: Number
    },
    vip: {
        type: Number,
        default: 0
    },
    cv_index: {
        type: Number,
        default: 0
    },
    cid: {
        type: Number
    },
    content: {
        type: String
    },
    mota_cv: {
        type: String
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
    lang_id: {
        type: Number
    },
    design_id: {
        type: Number
    },
    exp: {
        type: Number
    },
    nhucau: {
        type: Number
    },
    meta_title: {
        type: String
    },
    meta_key: {
        type: String
    },
    meta_des: {
        type: String
    },
    thutu: {
        type: Number
    },
    full: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    },
    cv_point: {
        type: Number,
        default: 0
    },
    note: {
        type: String
    },
    type: {
        // 1: cv thường, 2: cv ai
        type: Number,
        default: 1
    }
}, {
    collection: 'Cv365',
    versionKey: false
});
module.exports = mongoose.model("Cv365", Cv365Schema);