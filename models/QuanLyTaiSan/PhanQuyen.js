const mongoose = require("mongoose");
const model_PhanQuyen = new mongoose.Schema({
    id_phanquyen: {
        type: Number,
        unique: true
    },
    id_user: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    ds_ts: {
        type: String
    },
    capphat_thuhoi: {
        type: String
    },
    dieuchuyen_bangiao: {
        type: String
    },
    suachua_baoduong: {
        type: String
    },
    mat_huy_tl: {
        type: String
    },
    ql_nhanvien: {
        tpye: String
    },
    phan_quyen: {
        type: String
    }
},
    {
        collection: "QLTS_Phan_Quyen",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Phan_Quyen", model_PhanQuyen);