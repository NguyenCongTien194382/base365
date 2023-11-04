const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//lấy danh sách vị trí công ty chấm công bằng QR
const TrackingQR = new Schema({
    //ID của chấm công QR
    _id: {
        type: Number,
        required: true
    },
    //id công ty
    companyID: {
        type : Number,
    },
    latitude: {
        // Tọa độ lat
        type: String,
        default: null
    },
    longtitude: {
        // Tọa độ long
        type: String,
        default: null
    },
    Location:{
        //vị trí
        type : String
    },
    CreateAt:{
        //thời điểm tạo 
        type : Date,
        default : Date.now()
    },
    //Bán kính 
    radius: {
        type: Number
    },
    //chưa biết 

    isDefaul: {
        type: Number
    },

    status: {
        type: Number
    },

    QRlogo: {
        type: String
    },

    QRstatus : {
        type: Number
    },
})

module.exports = mongoose.model('TrackingQR', TrackingQR)