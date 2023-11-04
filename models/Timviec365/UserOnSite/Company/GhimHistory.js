const mongoose = require('mongoose');
const TV365GhimHistorySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["1", "4", "5", "6", null],
        default: null
    },
    created_time: {
        type: Number,
        default: 0
    },
    ghim_start: {
        type: Number,
        default: 0
    },
    ghim_end: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    //trạng thái đơn hàng (0: đơn chờ duyệt, 1: đơn đang hoạt động, 2: đơn hoàn thành, 3: đơn hết hạn, 4: đơn bị hủy)
    status: {
        type: Number,
        default: 0
    },
    bg_id: {
        type: String,
        default: null
    },
    bg_title: {
        type: String,
        default: null
    },
    new_id: {
        type: Number,
        default: null
    },
    new_title: {
        type: String,
        default: null
    },
    order_id: {
        type: Number,
        default: null
    },
    adm_id: {
        type: Number,
        default: 0
    },
}, {
    collection: 'TV365GhimHistory',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("TV365GhimHistory", TV365GhimHistorySchema);