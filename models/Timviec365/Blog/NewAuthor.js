const mongoose = require('mongoose');
const NewAuthorSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    author_type: {
        type: String,
        default: null
    },
    adm_id: {
        type: Number,
        default: null
    },
    author_content: {
        type: String,
        default: null
    },
    author_img: {
        type: String,
        default: null
    },
    mxh_vk: {
        type: String,
        default: null
    },
    mxh_trello: {
        type: String,
        default: null
    },
    mxh_medium: {
        type: String,
        default: null
    },
    mxh_behance: {
        type: String,
        default: null
    },
    mxh_twitter: {
        type: String,
        default: null
    },
    mxh_instagram: {
        type: String,
        default: null
    },
    mxh_facebook: {
        type: String,
        default: null
    }
}, {
    collection: 'NewAuthor',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewAuthor", NewAuthorSchema);