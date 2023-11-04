const mongoose = require('mongoose');
const Schema = mongoose.Schema
const AdminTranslateSchema = new mongoose.Schema({
    _id: {
        //id admin
        type: Number,
        require: true
    },
    tra_keyword: {
        //kyword
        type: String,
        default: null
    },
    tra_text: {
        //mật khẩu của admin,
        type: String,
        default: null
    },
    langId: {
        //mật khẩu của admin,
        type: Number,
        default: null
    },
    tra_source: {
        //tên admin
        type: String,
        default: null
    }
}, {
    collection: 'RN365_AdminTranslate',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_AdminTranslate", AdminTranslateSchema);