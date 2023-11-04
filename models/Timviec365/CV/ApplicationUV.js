//đơn xin việc ứng viên
const mongoose = require('mongoose'); //đơn xin việc ứng viên
const ApplicationUVSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
        unique: true
    },
    uid: {
        //id người tạo đơn
        type: Number,
        default: 0
    },
    tid: {
        type: Number,
        default: 0
    },
    lang: {
        //ngôn ngữ tạo đơn
        type: String,
        default: null
    },
    html: {
        type: String,
        default: null
    },
    name_img: {
        type: String,
        default: null
    },
    status: {
        // trạng thái
        type: Number,
        default: 0
    },
}, {
    collection: 'ApplicationUV',
    versionKey: false
});

module.exports = mongoose.model("ApplicationUV", ApplicationUVSchema);