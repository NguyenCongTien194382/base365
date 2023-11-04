const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ApplyNewsSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    uvId: {
        //id cua ung vien
        type: Number,
        default: null,
    },
    newId: {
        //id cua tin tuyen dung
        type: Number,
        default: 0,
    },
    time: {
        //tg apply
        type: Date,
        default: Date(Date.now()),
    },
    status: {
        //da duoc doanh nghiep chap nhan chua(0: chua)
        type: Number,
        default: 0,
    },
    note: {
        //ghi chu
        type: String,
        default: 0,
    },
    isDelete: {
      //ung vien bi xoa chua
        type: Number,
        default: 0,
    }

}, {
    collection: 'RN365_ApplyNews',
    versionKey: false,
    timestamp: true
})

    module.exports = mongoose.model("RN365_ApplyNews", ApplyNewsSchema);