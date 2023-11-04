const mongoose = require("mongoose");
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const HistoryCrmSchema = new mongoose.Schema({
    usc_id: {
        type: Number,
        default: 0
    },
    usc_group: {
        type: Number,
        default: 0
    },
    use_status: {
        // 1: đăng tin;2 sửa tin,3 làm mới tin,4: đăng nhập;5:chỉnh sửa thông tin công ty
        type: Number,
        default: 0
    },
    time_created: {
        type: Number,
        default: 0
    }
}, {
    collection: 'HistoryCrm',
    versionKey: false
});

module.exports = connection.model("HistoryCrm", HistoryCrmSchema);