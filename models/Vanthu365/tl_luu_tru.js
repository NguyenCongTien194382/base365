const mongoose = require('mongoose');
const tl_luu_tru = new mongoose.Schema({
    _id: {
        type: Number
    },
    ten_tl: {
        type: String,
        max: 255
    },
    nd_tl: {
        type: String,
        max: 255
    },
    file_tl: {
        type: String,
        max: 255
    },
    nguoi_tao_tai_lieu: {
        type: Number
    },
    id_nhom_vb: {
        type: Number
    },
    id_van_ban: {
        type: Number
    },
    id_nguoi_xem: {
        type: Number,
    },
    id_nguoi_tai: {
        type: Number,
    },
    thoigian_tai: {
        type: String,
        max: 255
    }
});
module.exports = mongoose.model('Vanthu_tl_luu_tru', tl_luu_tru);