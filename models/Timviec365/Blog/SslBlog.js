const mongoose = require('mongoose');
const TV365SslBlog = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
    },
    alias: {
        type: String,
    },
    link_301: {
        type: String
    },
    link_canonical: {
        type: String
    },
    cid: {
        type: Number
    },
    cate_blog: {
        type: Number
    },
    cate_cb: {
        type: Number
    },
    image: {
        type: String
    },
    file: {
        type: String
    },
    created_day: {
        type: Date
    },
    sapo: {
        type: String
    },
    content: {
        type: String
    },
    view: {
        type: Number
    },
    vip: {
        type: Number
    },
    status: {
        type: Number
    },
    uid: {
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
    }
}, {
    collection: 'TV365SslBlog',
    versionKey: false
});

module.exports = mongoose.model("TV365SslBlog", TV365SslBlog);