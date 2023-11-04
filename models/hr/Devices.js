const mongoose = require('mongoose');
const HR_DeviceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    userId: {
        type: Number,
        required: true,
    },
    infoBrower: {
        type: String,
        required: true,
    },
    token_browser	: {
        type: String,
    },
    lastLogin	: {
        type: String,
        required: true,
    },
    deviceType	: {
        //0: pc, 1: mobile, tablet
        type: Number,
        required: true,
        default: 0 
    },
    // 1. Đăng nhập công ty, 0. Đăng nhập nhân viên
    loginType	: {
        type: Number,
        required: true,
        default: 0 
    },
    createdAt	: {
        type: Date,
        required: true,
    },
}, {
    collection: 'HR_Devices',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_Devices", HR_DeviceSchema);