const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobOfferSchema = new Schema({
    // id contact job
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    //  ID ứng viên
    canId: { type: Number, required: true },
    // trạng thái xóa
    isDelete: { type: Number, default: 0 },
    // xóa vào ngày?
    deletedAt: { type: Date },
    // lương mong muon
    resiredSalary: { type: String, required: true },
    // lương thuc
    salary: { type: String, required: true },
    // ngày nhận offer
    offerTime: { type: Date, required: true },
    //
    epOffer: { type: Number, required: true },
    // ghi chú
    note: { type: String , default: null},
    // chuyển trạng thái
    isSwitch: { type: String, default: 0 },
    // ngày tạo
    createdAt: { type: Date, default: Date.now() }
}, {
    collection: 'HR_ContactJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_ContactJobs', JobOfferSchema);
