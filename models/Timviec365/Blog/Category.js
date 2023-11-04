const mongoose = require('mongoose');
const categoryBlogSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        default: null
    },
    adminID: {
        type: Number,
        default: null
    },
    langID: {
        type: Number,
        default: null
    },
    title: {
        type: String,
        default: null
    },
    keyword: {
        type: String,
        default: null
    },
    nameRewrite: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
    },
    picture: {
        type: String,
        default: null
    },
    type: {
        type: Number,
        default: null
    },
    form: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    parentID: {
        type: Number,
        default: null
    },
    hasChild: {
        type: Number,
        default: null
    },
    order: {
        type: Number,
        default: null
    },
    date: {
        type: Date,
        default: null
    },
    active: {
        type: Number,
        default: null
    },
    show: {
        type: Number,
        default: null
    },
    home: {
        type: Number,
        default: null
    },
}, {
    collection: 'CategoryBlog',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CategoryBlog", categoryBlogSchema);