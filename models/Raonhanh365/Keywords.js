const mongoose = require('mongoose');
const Schema = mongoose.Schema
const LanguagesSchema = new mongoose.Schema({
    key_id: {
        type: Number,
        require: true,
        unique: true,
    },
    key_name: {
        type: String,
        require: true
    },
    key_lq: {
        type: String,
        require: true
    },
    key_cate_id: {
        type: String,
        default: null
    },
    key_city_id: {
        type: String,
        default: null
    },
    key_qh_id: {
        type: String,
        default: null
    }, 
    key_city_id: {
        type: String,
        default: null
    }, 
    key_cb_id: {
        type: String,
        default: null
    }, 
    key_teaser: {
        type: String,
        default: null
    }, 
    key_type: {
        type: String,
        default: null
    }, 
    key_err: {
        type: String,
        default: null
    },
    key_qh_kcn: {
        type: String,
        default: null
    },
    key_cate_lq: {
        type: String,
        default: null
    },
    key_tit: {
        type: String,
        default: null
    },
    key_desc: {
        type: String,
        default: null
    },
    key_key: {
        type: String,
        default: null
    },
    key_h1: {
        type: String,
        default: null
    },
    key_time: {
        type: String,
        default: null
    },
    key_301: {
        type: String,
        default: null
    },
    key_index: {
        type: String,
        default: null
    },
    key_bao_ham: {
        type: String,
        default: null
    },
    key_tdgy: {
        type: String,
        default: null
    },
    key_ndgy: {
        type: String,
        default: null
    },

}, {
    collection: 'RN365_Keyword',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('RN365_Keyword', LanguagesSchema);