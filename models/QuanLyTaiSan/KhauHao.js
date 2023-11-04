const mongoose = require("mongoose");
const model_KHauHao = new mongoose.Schema({
    id_khau_hao: {
        type: Number,
        unique: true
    },
    kh_id_cty: {
        type: Number,
    },
    kh_id_ts: {
        type: Number
    },
    kh_gt: {
        type: Number
    },
    kh_so_ky: {
        type: Number
    },
    kh_type_ky: {
        type: Number
    },
    kh_so_ky_con_lai: {
        type: Number
    },
    kh_gt_da_kh: {
        type: Number
    },
    kh_gt_cho_kh: {
        type: Number
    },
    kh_day_start: {
        type: Number
    },
    kh_day_create: {
        type: Number
    },
    kh_ng_tao: {
        type: Number
    },
    kh_quyen_tao: {
        type: Number,
        default : 1
    }

}, {
    collection: "QLTS_Khau_Hao",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Khau_Hao", model_KHauHao);