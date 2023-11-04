const mongoose = require("mongoose");
const model_Baoduong = new mongoose.Schema({
    id_bd: {
        type: Number,
        unique: true
    },
    baoduong_taisan: {
        type: Number,
    },
    bd_sl: {
        type: Number,
    },
    id_cty: {
        type: Number
    },
    bd_tai_congsuat: {
        type: Number,
    },
    bd_cs_dukien: {
        type: Number
    },
    bd_gannhat: {
        type: Number,
    },
    bd_trang_thai: {
        type: Number,
    },
    bd_ngay_batdau: {
        type: Number
    },
    bd_dukien_ht: {
        type: Number
    },
    bd_ngay_ht: {
        type: Number,
    },
    bd_noi_dung: {
        type: String,
    },
    bd_chiphi_dukien: {
        type: Number
    },
    bd_chiphi_thucte: {
        type: Number,
    },
    bd_ng_thuchien: {
        type: Number,
    },
    donvi_bd: {
        type: String,
    },
    dia_diem_bd: {
        type: Number,
    },
    diachi_nha_cc: {
        type: String,
    },
    bd_ngay_sudung: {
        type: Number
    },
    bd_type_quyen: {
        type: Number,
    },
    bd_id_ng_xoa: {
        type: Number,
    },
    bd_id_ng_tao: {
        type: Number,
    },
    bd_ng_sd: {
        type: Number,
    },
    bd_type_quyen_sd: {
        type: Number,
    },
    bd_vi_tri_dang_sd: {
        type: String,
    },
    xoa_bd: {
        type: Number,
        default: 0
    },
    bd_date_create: {
        type: Number,
    },
    bd_date_delete: {
        type: Number,
    },
    lydo_tu_choi: {
        type: String,
    },
    bd_type_quyen_xoa: {
        type: Number
    }

}, {
    collection: "QLTS_Bao_Duong",
    versionKey: false,
}
);
module.exports = mongoose.model("QLTS_Bao_Duong", model_Baoduong);