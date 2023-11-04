// sơ yếu lý lịch
const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
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
    html: {
        type: String
    },
    colors: {
        type: String
    },
    status: {
        type: Number
    },
    cate_id: {
        type: Number
    },
    vip: {
        type: Number
    },
}, {
    collection: 'Resume',
    versionKey: false
});

module.exports = mongoose.model('Resume', ResumeSchema);