const mongoose = require('mongoose');
const CategoryCVSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
    },
    alias: {
        type: String,
    },
    meta_h1: {
        type: String,
    },
    content: {
        type: String
    },
    cid: {
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
    meta_tt: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    }
}, {
    collection: 'CategoryCV',
    versionKey: false
});

module.exports = mongoose.model("CategoryCV", CategoryCVSchema);