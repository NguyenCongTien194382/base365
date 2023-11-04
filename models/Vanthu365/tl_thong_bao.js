const mongoose = require('mongoose');
const tl_ThongBao = new mongoose.Schema({
    _id: {
        type: Number,
        default: 0
    },
    id_user: {
        type: Number,
        default: 0
    },
    id_user_nhan: {
        type: Number,
        default: 0
    },
    id_van_ban: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    created_date: {
        type: Number,
        default: 0
    }

});
module.exports = mongoose.model("Vanthu_thong_bao", tl_ThongBao);
