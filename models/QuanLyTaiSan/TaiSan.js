const mongoose = require("mongoose");
const model_Tai_San = new mongoose.Schema({
    ts_id: {
        type: Number,
        require: true,
    },
    id_cty: {
        type: Number,
        default: 0
    },
    id_loai_ts: {
        type: Number,
        default: 0
    },
    id_nhom_ts: {
        type: Number,
        default: 0
    },
    id_dv_quanly: {
        type: String,
        default: 0
    },
    id_ten_quanly: {
        type: Number
    },
    ts_ten: {
        type: String
    },
    sl_bandau: {
        type: Number,
        default : 0
    },
    ts_so_luong: {
        type: Number,
        default: 0
    },
    soluong_cp_bb: {
        type: Number,
        default : 0
    },
    ts_gia_tri: {
        type: Number,
        default : 0
    },
    ts_don_vi: {
        type: String,
        default : 0
    },
    ts_vi_tri: {
        type: Number,
        default : 0
    },
    ts_trangthai: {
        type: Number,
        default : 0
    },
    ts_date_sd: {
        type: Number,
        default: 0
    },
    ts_type_quyen: {
        type: Number,
        default: 0
    },
    ts_type_quyen_xoa: {
        type: Number,
        default: 0
    },
    ts_id_ng_xoa: {
        type: Number,
        default: 0
    },
    ts_da_xoa: {
        type: Number,
        default: 0
    },
    ts_date_create: {
        type: Number
    },
    ts_date_delete: {
        type: Number,
        default: 0
    },
    don_vi_tinh: {
        type: String,
        default: 0
    },
    ghi_chu: {
        type: String,
        default: ''
    }
},
    {
        collection: "QLTS_Tai_San",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Tai_San", model_Tai_San);