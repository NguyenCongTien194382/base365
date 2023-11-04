const mongoose = require("mongoose");
const model_Sua_chua = new mongoose.Schema({
    sc_id: {
        type: Number,
        require: true,
        unique: true
    },
    suachua_taisan: {
        type: Number,
        default: 0
    },
    sl_sc: {
        type: Number,
        default: 0
    },
    id_cty: {
        type: Number,
        default: 0
    },
    sc_ng_thuchien: {
        type: Number,
        default: 0
    },
    sc_ng_duyet: {
        type: Number,
        default: 0
    },
    sc_date_duyet: {
        type: Number,
        default: 0
    },
    sc_trangthai: {
        type: Number,
        default: 0
    },
    sc_ngay_hong: {
        type: Number,
        default: 0
    },
    sc_ngay: {
        type: Number,
        default: 0
    },
    sc_dukien: {
        type: Number,
        default: 0
    },
    sc_hoanthanh: {
        type: Number,
        default: 0
    },
    sc_noidung: {
        type: String,
        default: null
    },
    sc_chiphi_dukien: {
        type: Number,
        default: 0
    },
    sc_chiphi_thucte: {
        type: Number,
        default: 0
    },
    sc_donvi: {
        type: String,
        default: null
    },
    sc_loai_diadiem: {
        type: Number,
        default: 0
    },
    sc_diachi: {
        type: String,
        default: null
    },
    sc_ngay_nhapkho: {
        type: Number,
        default: 0
    },
    sc_lydo_tuchoi: {
        type: String,
        default: null
    },
    sc_type_quyen: {
        type: Number,
        default: 0
    },
    sc_id_ng_tao: {
        type: Number,
        default: 0
    },
    sc_id_ng_xoa: {
        type: Number,
        default: 0
    },
    sc_da_xoa: {
        type: Number,
        default: 0
    },
    sc_date_create: {
        type: Number,
        default: 0
    },
    sc_date_delete: {
        type: Number,
        default: 0
    },
    sc_ng_sd: {
        type: Number,
        default: 0
    },
    sc_quyen_sd: {
        type: Number
    },
    sc_ts_vitri: {
        type: String,
        default: 0
    },
    sc_type_quyen_xoa: {
        type: Number,
        default: 0
    },
    sc_type_quyet_duyet: {
        type: Number, 
        default: 0
    } 
},
    {
        collection: "QLTS_Sua_chua",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Sua_chua", model_Sua_chua);