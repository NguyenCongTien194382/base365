const mongoose = require("mongoose");
const model_QuaTrinhSuDung = new mongoose.Schema({
    quatrinh_id: {
        type: Number,
        require : true,
        unique: true
    },
    id_ts: {
        type: Number,
        default : null
    },
    id_bien_ban: {
        type: Number,
        default :0
    },
    so_lg: {
        type: Number,
        default :0
    },
    id_cty: {
        type: Number,
        default :0
    },
    id_ng_sudung: {
        type: Number,
        default :0
    },
    id_phong_sudung: {
        type: Number,
        default :0
    },
    id_cty_sudung: {
        type: Number,
        default :0
    },
    qt_ngay_thuchien: {
        type: String,
        default : 0
    },
    qt_nghiep_vu: {
        type: Number,
        default : 0
    },
    vitri_ts: {
        type: String,
        default : ""
    },
    ghi_chu: {
        type: String,
        default : ""
    },
    time_created: {
        type: Number,
        default : 0
    }
},
    {
        collection: "QLTS_QuaTrinhSuDung",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_QuaTrinhSuDung", model_QuaTrinhSuDung);