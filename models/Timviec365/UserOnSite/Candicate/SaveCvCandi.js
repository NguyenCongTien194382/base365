//cv ứng viên
const mongoose = require('mongoose');
const SaveCvCandiSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        // autoIncrement: true
    },
    uid: {
        //id người tạo cv
        type: Number,
        default: 0
    },
    cvid: {
        //id của mẫu cv
        type: Number,
        default: 0
    },
    lang: {
        // ngôn ngữ tạo cv
        type: String,
        default: null
    },
    html: {
        // nội dung cv
        type: String,
        default: null
    },
    name_img: {
        // ảnh cv
        type: String,
        default: null
    },
    name_img_hide: {
        // ảnh cv che thông tin
        type: String,
        default: null
    },
    time_edit: {
        // thời gian chỉnh sửa cv
        type: Number,
        default: 0
    },
    cv: {
        // là trường đại diện
        type: Number,
        default: 0
    },
    status: {
        //trạng thái cv
        type: Number,
        default: 0
    },
    delete_cv: {
        //cv đã xóa hay ch
        type: Number,
        default: 0
    },
    delete_time: {
        //Thời gian xóa cv
        type: Number,
        default: 0
    },
    height_cv: {
        type: Number,
        default: 0
    },
    scan: {
        type: Number,
        default: 0
    },
    state: {
        type: Number,
        default: 0
    },
    type_cv: {
        // 1: Cv thường, 2: Cv tạo bằng Ai
        type: Number,
        default: 1
    },
}, {
    collection: 'SaveCvCandi',
    versionKey: false
});

module.exports = mongoose.model("SaveCvCandi", SaveCvCandiSchema);