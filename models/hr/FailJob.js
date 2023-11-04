const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const failJob = new Schema({
    // ID Job Fail
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // ID ứng vien
    canId: { type: Number, required: true },
    // kiểu
    type: { type: Number, default: 0 },
    // Xóa hay chưa
    isDelete: { type: Number, default: 0 },
    // xóa vào thời gian nào
    deletedAt: { type: Date, default: null },
    //  Note
    note: { type: String, default: null },
    // email
    email: { type: String, required: true },
    // nội dung gửi
    contentsend: { type: String },
    //
    isSwitch: { type: Number, default: 0 },
    // ngày tạo
    createdAt: { type: Date, default: Date.now() },
}, {
    collection: 'HR_FailJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_FailJobs', failJob);

