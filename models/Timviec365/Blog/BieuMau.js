const mongoose = require('mongoose');
const BieuMauSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    bm_cate: {
        type: String,
        default: null
    },
    bm_order: {
        type: Number,
        default: null
    },
    bm_footer_order: {
        type: Number,
        default: null
    },
    bm_description: {
        type: String,
        default: null
    },
    bm_h1: {
        type: String,
        default: null
    },
    bm_keyword: {
        type: String,
        default: null
    },
    bm_title: {
        type: String,
        default: null
    },
    bm_mota: {
        type: String,
        default: null
    },
}, {
    collection: 'BieuMau',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("BieuMau", BieuMauSchema);