const mongoose = require("mongoose");
const model_Quydinh_bd = new mongoose.Schema({
    qd_id: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number
    },
    id_loai: {
        type: Number
    },
    tan_suat_bd: {
        type: Number
    },
    bd_lap_lai_theo: {
        type: Number
    },
    sl_ngay_lap_lai: {
        type: Number
    },
    bd_noidung: {
        type: String
    },
    xac_dinh_bd: {
        type: Number
    },
    thoidiem_bd: {
        tpye: String
    },
    sl_ngay_thoi_diem: {
        type: Number
    },
    ngay_tu_chon_td : {
        type : Number
    },
    chon_don_vi_do : {
        type : Number
    },
    cong_suat_bd : {
        type : Number
    },
    qd_type_quyen : {
        type : Number
    },
    id_ng_tao_qd : {
        type : Number
    },
    qd_id_ng_xoa : {
        type : Number
    },
    qd_xoa : {
        type : Number
    },
    qd_date_create : {
        type : Number
    },
    qd_date_delete : {
        type : Number
    },
    qd_type_quyen_xoa : {
        type : Number
    }
},
    {
        collection: "QLTS_Quydinh_bd",
        versionKey: false
    });
module.exports = mongoose.model("QLTS__Quydinh_bd", model_Quydinh_bd);