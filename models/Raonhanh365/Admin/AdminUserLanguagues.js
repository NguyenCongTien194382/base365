const mongoose = require('mongoose');
const Schema = mongoose.Schema
const AdminUserLanguaguesSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    adminId: {
        type: Number,
        require: true
    },
    langId: {
        type: Number,
        require: true
    },
}, {
    collection: 'RN365_AdminUserLanguagues',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_AdminUserLanguagues", AdminUserLanguaguesSchema);