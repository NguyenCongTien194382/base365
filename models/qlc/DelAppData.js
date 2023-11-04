const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DelAppDataSchema = new Schema({
    _id: {//ID danh sách lịch làm việc cho nhân viên
        type: Number,
        required: true
    },
    idQLC: {
        type: Number
    },
    com_id: {//ID cty
        type: Number
    },
    appID: {//ứng dụng cần xóa 
        type: Number
    },
    timeOption: {//lựa chọn thời gian xóa
        type: Number
    },
    appData: {//dữ liệu cần xóa
        type: Date
    },
    note: { //chi tiết
        type: String
    },
})

module.exports = mongoose.model('DelAppData', DelAppDataSchema);