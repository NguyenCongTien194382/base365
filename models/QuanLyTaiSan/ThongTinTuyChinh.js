const mongoose = require("mongoose");
const model_ThongTinTuyChinh = new mongoose.Schema({
    id_tt: {
        type: Number,
    require : true
    },
    com_id_tt: {
        type: Number
    },
    id_nhom_ts: {
        type: Number
    },
    tt_ten_truong: {
        type: String
    },
    kieu_du_lieu: {
        type: Number
    },
    noidung_mota: {
        type: String
    },
    ng_tao: {
        type: Number
    },
    type_quyen_tao: {
        type: Number
    },
    tt_date_create: {
        type: Number
    },
    tt_xoa: {
        type: Number,
        default : 0
    },
    ng_xoa : {
        type : Number,
        default : 0
    },
    ngay_xoa : {
        type : Number,
        default : 0
    },
    type_quyen_xoa : {
        type : Number,
        default : 0
    }
},
    {
        collection: "QLTS_ThongTinTuyChinh",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ThongTinTuyChinh", model_ThongTinTuyChinh);