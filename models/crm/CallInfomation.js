//model này dùng để lưu các cuộc gọi trông danh sách khách hàng
const mongoose = require('mongoose')
const CallInfomationSchema = mongoose.Schema({
    _id: {
        //phân biệt các bản ghi cuộc gọi
        type: Number,
        require: true
    },
    callNumber: {
        // số gọi
        type: String,
        require: true
    },
    receiveNumber: {
        // số nghe
        type: String,
        require: true
    },
    timediff: {
        // thời lượng cuộc gọi
        type: Number,
        get: function() {
            return (this.updatedate - this.createdate) / 1000;
        },
        require: true,
    },
    statusCall: {
        // trạng thái cuộc gọi
        type: Number,
        default: 0,
    }
}, {
    collection: "CallInfomation",
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CallInfomation", CallInfomationSchema)