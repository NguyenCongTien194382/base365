const mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const keywordSchema = new mongoose.Schema({
    key_id: {
        type: Number,
        unique: true
    },
    key_name: {
        type: String,
    },
    key_lq: {
        type: String,
    },
    key_cate_id: {
        type: Number,
    },
    key_city_id: {
        type: Number,
    },
    key_qh_id: {
        type: Number,
    },
    key_cb_id: {
        type: Number,
    },
    key_teaser: {
        type: String,
    },
    key_type: {
        type: Number,
    },
    key_err: {
        type: Number,
    },
    key_qh_kcn: {
        type: Number,
    },
    key_cate_lq: {
        type: Number,
    },
    key_tit: {
        type: String,
    },
    key_desc: {
        type: String,
    },
    key_key: {
        type: String,
    },
    key_h1: {
        type: String,
    },
    key_time: {
        type: Number,
    },
    key_301: {
        type: String,
    },
    key_index: {
        type: Number,
    },
    key_bao_ham: {
        type: Number,
    },
    key_tdgy: {
        type: String,
    },
    key_ndgy: {
        type: String,
    },
}, {
    collection: 'KeyWord',
    versionKey: false,
    timestamp: true
})
module.exports = connection.model("KeyWord", keywordSchema);