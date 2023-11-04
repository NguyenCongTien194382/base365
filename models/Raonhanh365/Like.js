const mongoose = require('mongoose');
const Schema = mongoose.Schema
const LikeSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    forUrlNew: {
        //like cho tin nao
        type: String,
        default: null,
    },
    type: {
        //thich/tym/haha/phan no
        type: Number,
        default: 0,
    },
    commentId: {
        //id cua commnet
        type: Number,
        default: 0,
    },
    userName: {
        //ten
        type: String,
        default: null,
    },
    userAvatar: {
        //avatar
        type: String,
        default: null,
    },
    userIdChat: {
        //idchat cua nguoi binh luan
        type: Number,
        default: null,
    },
    ip: {
        //dia chi ip cua user
        type: String,
        default: null,
    },
    time: {
        //thoi gian like
        type: Date,
        default: Date(Date.now())
    },

}, {
    collection: 'RN365_Like',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Like", LikeSchema);