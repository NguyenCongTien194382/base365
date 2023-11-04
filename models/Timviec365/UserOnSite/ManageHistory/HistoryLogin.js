const mongoose = require('mongoose');
const TV365HistoryLoginSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            default: 0,
        }, 
        userId: {
            type: Number,
            default: 0,
        },
        //loại tài khoản
        type: {
            type: Number,
            default: 0,
        },
        //t/gian bắt đầu vào site
        timeLogin: {
            type: Number,
            default: 0,
        }, 
        //Thời gian rời site
        timeLogout: {
            type: Number,
            default: 0,
        },
        isOnline: {
            type: Number,
            default: 0,
        },
    },
    {
        collection: "TV365HistoryLogin"
    })
module.exports = mongoose.model("TV365HistoryLogin", TV365HistoryLoginSchema);