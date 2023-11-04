const mongoose = require('mongoose');
const BoDeNewsSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    bdn_name: {
        type: String,
        default: null
    },
    bdn_301: {
        type: String,
        default: null
    },
    bdn_title: {
        type: String,
        default: null
    },
    bdn_url: {
        type: String,
        default: null
    },
    bdn_cate_id: {
        type: Number,
        default: null
    },
    bdn_tag_id: {
        type: Number,
        default: null
    },
    bdn_avatar: {
        type: String,
        default: null
    },
    bdn_picture_web: {
        type: String,
        default: null
    },
    bdn_picture_web2: {
        type: String,
        default: null
    },
    bdn_link_web: {
        type: String,
        default: null
    },
    bdn_teaser: {
        type: String,
        default: null
    },
    bdn_sapo: {
        type: String,
        default: null
    },
    bdn_description: {
        type: String,
        default: null
    },
    bdn_view: {
        type: Number,
        default: null
    },
    bdn_time: {
        type: String,
        default: null
    },
    bdn_dg: {
        type: Number,
        default: null
    },
    bdn_cate_url: {
        type: String,
        default: null
    },
    bdn_point_dg: {
        type: Number,
        default: null
    },
    bdn_admin_edit: {
        type: Number,
        default: null
    },
    bdn_audio: {
        type: Number,
        default: null
    },
}, {
    collection: 'BoDeNews',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("BoDeNews", BoDeNewsSchema);