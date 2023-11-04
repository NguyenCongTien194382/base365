//Thư ứng viên
const mongoose = require('mongoose');
const LetterUVSchema = new mongoose.Schema({
    id: {
        type: Number
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
    collection: 'LetterUV',
    versionKey: false
})

module.exports = mongoose.model("LetterUV", LetterUVSchema);