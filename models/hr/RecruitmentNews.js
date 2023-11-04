const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentNewsSchema = new Schema({
    //Id của quy trình tuyển dụng
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // tên tiêu đề tuyển dụng
    title: {
        type: String,
        default: null
    },
    // vị trí tuyển dụng
    posApply: {
        type: Number,
        default: 0
    },
    // id thành phố
    cityId: {
        type: Number,
        default: 0
    },
    // địa chỉ 
    address: {
        type: String,
        default: null
    },
    // id danh mục
    cateId: {
        type: Number,
        default: 0
    },
    // id lương
    salaryId: {
        type: Number,
        default: 0
    },
    // số lượng muốn tuyển
    number: {
        type: Number,
        default: 0
    },
    // thời gian bắt đầu
    timeStart: {
        type: Date,
        default: null
    },
    // thời gian kết thúc
    timeEnd: {
        type: Date,
        default: null
    },
    // chi tiết công việc
    jobDetail: {
        type: String,
        default: null
    },
    // hình thức làm việc
    wokingForm: {
        type: Number,
        default: 0
    },
    // thời gian thử việc
    probationaryTime: {
        type: String,
        default: null
    },
    // tiền hoa hồng
    moneyTip: {
        type: Number,
        default: 0
    },
    // mô tả công việc
    jobDes: {
        type: String,
        default: null
    },
    // quyền lợi
    interest: {
        type: String,
        default: null
    },
     //id tuyen dung
    recruitmentId: {
        type: Number,
        require: true
    },
    // kinh nghiệm
    jobExp: {
        type: Number,
        default: 0
    },
    // bằng cấp
    degree: {
        type: Number,
        default: 0
    },
    // giới tính
    gender: {
        type: Number,
        default: 0
    },
    // yêu cầu công việc
    jobRequire: {
        type: String,
        default: null
    },
    //thành viên theo dõi
    memberFollow: {
        type: Number,
        default: null
    },
    //id cua hr
    hrName: {
        type: Number,
        default: null
    },
    // thời gian tạo
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // thời gian update
    updatedAt: {
        type: Date,
        default: null
    },
    // thời gian xoá
    deletedAt: {
        type: Date,
        default: null
    },
    // đã xoá chưa
    isDelete: {
        type: Number,
        default: 0,
    },
    // id công ty
    comId: {
        type: Number,
        default: 0,
    },
    // có phải công ty
    isCom: {
        type: Number,
        default: 0,
    },
    // được tạo bởi
    createdBy: {
        type: String,
        default: null,
    },
    isSample: {
        type: Number,
        default: 0,
    },
},{
    collection: 'HR_RecruitmentNews',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_RecruitmentNews", RecruitmentNewsSchema);