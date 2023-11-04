const mongoose = require('mongoose');
const BieuMauNewSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    bmn_name: {
        type: String,
        default: null
    },
    bmn_title: {
        type: String,
        default: null
    },
    bmn_url: {
        type: String,
        default: null
    },
    bmn_301: {
        type: String,
        default: null
    },
    bmn_cate_id: {
        type: Number,
        default: null
    },
    bmn_tag_id: {
        type: Number,
        default: null
    },
    bmn_avatar: {
        type: String,
        default: null
    },
    bmn_teaser: {
        type: String,
        default: null
    },
    bmn_description: {
        type: String,
        default: null
    },
    bmn_sapo: {
        type: String,
        default: null
    },
    bmn_ghim: {
        type: Number,
        default: 0
    },
    bmn_view: {
        type: Number,
        default: 0
    },
    bmn_time: {
        type: Date,
        default: null
    },
    bmn_time_edit: {
        type: Date,
        default: null
    },
    bmn_file: {
        type: Number,
        default: 0
    },
    bmn_dg: {
        type: Number,
        default: 0
    },
    bmn_cate_url: {
        type: String,
        default: null
    },
    bmn_point_dg: {
        type: Number,
        default: 0
    },
    bmn_admin_edit: {
        type: Number,
        default: 0
    },
    bmn_audio: {
        type: Number,
        default: 0
    },
}, {
    collection: 'BieuMauNew',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("BieuMauNew", BieuMauNewSchema);