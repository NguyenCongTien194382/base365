const mongoose = require('mongoose');
const Tv365TblBaoLuuSchema = new mongoose.Schema({
    id_ntd_bl: {
        type: Number,
        default: 0
    },
    goi_bl: {
        type: String,
        require: true
    },
    so_luong_tin_bl: {
        type: String,
        default: null,
    },
    time_su_dung_bl: {
        type: String,
        default: null,
    },
    so_tin_tang_bl: {
        type: String,
        default: null
    },
    point_bl: {
        type: String,
        default: null
    },
    han_bao_luu: {
        type: String,
        default: null
    }
}, {
    collection: 'Tv365TblBaoLuu',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365TblBaoLuu", Tv365TblBaoLuuSchema);