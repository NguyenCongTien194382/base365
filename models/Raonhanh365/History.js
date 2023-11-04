    const mongoose = require('mongoose');
const Schema = mongoose.Schema
const HistorySchema = new mongoose.Schema({
    _id: {
        //id lịch sử
        type: Number,
        required: true,
    },
    userId: {
        //id raonhanh của người dùng
        type: Number,
        required: true,
    },
    seri: {
        //seri của thẻ
        type: String,
        default: null
    },
    cardId: {
        //mã thẻ
        type: String,
        default: null
    },
    tranId: {
        type: String,
        default: null
    },
    price: {
        //giá tiền
        type: Number,
        default: 0
    },
    priceSuccess: {
        //giá tiền sau khi thành công
        type: Number,
        default: 0
    },
    time: {
        //thời gian chuyển tiền
        type: Date,
        default: null
    },
    networkOperatorName: {
        //tên nhà mạng
        type: String,
        default: null
    },
    bank: {
        //tên ngân hàng
        type: String,
        default: null
    },
    bankNumber: {
        //số tài khoản ngân hàng
        type: String,
        default: null
    },
    cardHolder: {
        //chủ thẻ
        type: String,
        default: null
    },
    type: {
        //1: NTD, 5:cá nhân
        type: Number,
        default: 0
    },
    status: {
        //trạng thái nạp tiền
        type: Number,
        default: 0
    },
    content: {
        //nội dung chuyển khoản
        type: String,
        default: null
    },
    countGetMoney: {
        //tổng tiền nhận
        type: Number,
        default: 0
    },
    distinguish: {
        //phân biệt: 0:nạp tiền 1:ghim tin, 2 đẩy tin
        type: Number,
        default: 0
    }

}, {
    collection: 'RN365_History',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_History", HistorySchema);