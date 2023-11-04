//Thư ứng viên
const mongoose = require('mongoose');
const ResumeUVSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    uid: {
        //id người tạo thư
        type: Number
    },
    tid: {
        type: Number
    },
    lang: {
        // ngôn ngữ thư
        type: String
    },
    html: {
        //nội dung thư
        type: String
    },
    name_img: {
        //tên ảnh
        type: String
    },
    status: {
        //trang thái
        type: Number
    }
}, {
    collection: 'ResumeUV',
    versionKey: false
})

module.exports = mongoose.model("ResumeUV", ResumeUVSchema);