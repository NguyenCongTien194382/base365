const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CancelJob = new Schema({
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
    type: { type: Number , default: 0},
    // Xóa hay chưa
    isDelete: { type: Number, default: 0 },
    // xóa vào thời gian nào
    deletedAt: { type: Date , default: null},
    //    lương hưu
    resiredSalary: { type: String, default: 0 },
    //     Luoơng
    salary: { type: String , default: 0},
    //  Note
    note: { type: String, default: null },
    //     Trạng thái
    status: { type: Number},
    //
    isSwitch: { type: Number, default: 0 },
    // ngày tạo
    createdAt: { type: Date, default: Date.now() }
},  {
    collection: 'HR_CancelJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_CancelJobs', CancelJob);

