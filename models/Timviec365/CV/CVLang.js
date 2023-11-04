const mongoose = require('mongoose');
const Cv365LangCv = new mongoose.Schema({
    id: {
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
    collection: 'Cv365LangCv',
    versionKey: false
});

module.exports = mongoose.model("Cv365LangCv", Cv365LangCv);