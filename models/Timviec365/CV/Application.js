// đơn xin việc
const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    name_sub: {
        type: String
    },
    alias: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
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
    colors: {
        type: String
    },
    html_vi: {
        type: String
    },
    html_en: {
        type: String
    },
    html_cn: {
        type: String
    },
    html_jp: {
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
    tid: {
        type: Number
    },
    status: {
        type: Number
    },
    vip: {
        type: Number
    }
}, {
    collection: 'Application',
    versionKey: false
});

module.exports = mongoose.model("Application", ApplicationSchema);