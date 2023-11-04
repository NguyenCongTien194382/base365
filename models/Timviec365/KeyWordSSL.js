const mongoose = require('mongoose');
const KeyWordSSLSchema = new mongoose.Schema({
    key_ssl_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    key_ssl_name: {
        type: String,
    },
    key_ssl_teaser: {
        type: String,
        default: null
    },
    key_ssl_nn: {
        type: Number,
        default: null
    },
    key_ssl_tt: {
        type: Number,
        default: null
    },
    key_ssl_301: {
        type: String,
        default: null
    },
    key_ssl_index: {
        type: Number,
        default: null
    },
    key_tdgy: {
        type: String,
        default: 0
    },
    key_ndgy: {
        type: String,
        default: 0
    },
    key_time: {
        // tổng việc làm của ngành nghề
        type: Number,
        default: 0
    }
}, {
    collection: 'KeyWordSSL',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("KeyWordSSL", KeyWordSSLSchema);