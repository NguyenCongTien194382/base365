const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // tên thành phố
    name: String,
    order: {
        // mức độ ưu tiên
        type: Number,
        default: 0
    },
    type: Number,
    count: {
        // số lượng
        type: Number,
        default: 0
    },
    countVl: {
        type: Number,
        default: 0
    },
    countVlch: Number,
    postCode: {
        // mã số
        type: String,
        required: true
    },
    tw: {
        type: Number,
        required: true
    },
    code: {
        // mã chữ
        type: String,
        required: true
    },
    cCode: {
        // mã chứ viết tắt
        type: String,
        required: true
    },
    imgCity: {
        // img của thành phố
        type: String,
        required: true
    },
    area: {
        // 1 miền bắc , 2 miền trung , 3 miền nam
        type: Number,
        required: true
    }
}, {
    collection: 'City',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("City", citySchema);