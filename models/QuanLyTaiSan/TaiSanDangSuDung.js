const mongoose = require("mongoose");
const model_TaiSanDangSuDung = new mongoose.Schema({
    id_sd: {
        type: Number,
        required: true,
        unique: true
    },
    com_id_sd: {
        type: Number,
        default:0
    },
    id_nv_sd: {
        type: Number,
        default:0
    },
    id_pb_sd: {
        type: Number,
        default:0
    },
    id_ts_sd: {
        type: Number,
        default:0
    },
    sl_dang_sd: {
        type: Number,
        default:0
    },
    doi_tuong_dang_sd: {
        type: Number,
        default:0
    },
    day_bd_sd: {
        type: Number,
        default:0
    },
    tinhtrang_ts: {
        type: Number,
        default:0
    }
},
    {
        collection: "QLTS_TaiSanDangSuDung",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TaiSanDangSuDung", model_TaiSanDangSuDung);