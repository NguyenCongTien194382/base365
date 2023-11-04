const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//lấy danh sách vị trí công ty chấm công bằng QR
const CompanyWifi = new Schema({
    //ID của chấm công QR
    wifi_id: {
        type: Number,
        required: true,
        unique: true
    },
    //id công ty
    com_id: {
        type: Number,
        default: 0
    },
    name_wifi: {
        // tên wifi
        type: String,
        default: null
    },
    mac_address: {
        type: String,
        default: null
    },
    ip_address: {
        type: String,
        default: null
    },
    create_time: {
        //thời điểm tạo 
        type: Number,
        default: 0
    },
    is_default: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
}, {
    collection: 'QLC_CompanyWifi',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_CompanyWifi', CompanyWifi)