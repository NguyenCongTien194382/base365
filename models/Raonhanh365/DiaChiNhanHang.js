const mongoose = require('mongoose');
const RN365_DongSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    us_id: {
        type: Number,
        required: true,
    },
    nguoi_nhang:{
        type:String,
        default:null
    },
    sdt_nhang: {
        type: String,
        default:null
    },
    dia_chi:{
        type:String,
        default:null
    },
    tgian_them:{
        type: Number,
        default:new Date().getTime() / 1000,
    }

}, {
    collection: 'RN365_DiaChiNhanHang',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_DiaChiNhanHang", RN365_DongSchema);