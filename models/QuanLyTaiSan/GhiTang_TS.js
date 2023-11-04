const mongoose = require("mongoose");
const model_GhiTangTS = new mongoose.Schema({
    id_ghitang: {
        type: Number,
        unique: true
    },
    id_ts: {
        type: Number,
        default : 0
    },
    com_id : {
        type: Number
    },
    sl_tang: {
        type: Number,
        default : 0
    },
    id_ng_tao: {
        type: Number,
        default : 0
    },
    type_quyen_tao: {
        type: Number,
        default : 0
    },
    id_ng_duyet: {
        type: Number,
        default : 0
    },
    type_quyen_duyet: {
        type: Number,
        default : 0
    },
    id_ng_xoa: {
        type: Number,
        default : 0
    },
    type_ng_xoa: {
        type: Number,
        default : 0
    },
    day_duyet: {
        type: Number,
        default : 0
    },
    day_tao: {
        type: Number,
        default : 0
    },
    day_xoa: {
        type: Number,
        default : 0
    },
    xoa_ghi_tang: {
        type: Number,
        default : 0
    },
    trang_thai_ghi_tang: {
        type: Number,
        default : 0
    },
    gt_ghi_chu: {
        type: String,
        default : ""
    },
    lydo_tu_choi: {
        type: String,
        default : ""
    }

},
    {
        collection: "QLTS_Ghi_Tang_TS",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Ghi_Tang_TSv", model_GhiTangTS);