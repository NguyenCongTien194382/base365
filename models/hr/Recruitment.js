const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentSchema = new Schema({
    //Id của quy trình tuyển dụng
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // tên quy trình tuyển dụng
    name: {
        type: String,
        require: true
    },
    // tên đơn vị, người tạo
    createdBy: {
        type: String,
        default: null
    },
    // thời gian tạo
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // thời gian xoá
    deletedAt: {
        type: Date,
        require: null
    },
    // đã xoá chưa
    isDelete: {
        type: Number,
        default: 0
    },
    // áp dụng cho đối tượng 
    applyFor: {
        type: String,
        default: null
    },
    // 
    slug: {
        type: String,
        require: true
    },
    // id công ty
    comId: {
        type: Number,
        require: true
    },
    // có phải công ty không
    isCom: {
        type: Number,
        require: true
    }
},{
    collection: 'HR_Recruitment',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Recruitment", RecruitmentSchema);