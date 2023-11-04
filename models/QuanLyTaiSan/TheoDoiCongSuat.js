const mongoose = require("mongoose");
const model_TheoDoiCongSuat = new mongoose.Schema({
    id_cs: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number,
        default: 0
    },
    id_loai: {
        type: Number
    },
    id_donvi: {
        type: Number,
        default: 0
    },
    update_cs_theo: {
        type: Number,
        default: 0
    },
    nhap_ngay: {
        type: Number,
        default: 0
    },
    chon_ngay: {
        type: Number,
        default: 0
    },
    cs_gannhat: {
        type: Number,
        default: 0
    },
    tdcs_type_quyen: {
        type: Number,
        default: 0
    },
    tdcs_id_ng_xoa: {
        type: Number,
        default: 0
    },
    tdcs_xoa: {
        type: Number,
        default: 0
    },
    tdcs_date_create: {
        type: Number,
        default: 0
    },
    tdcs_date_delete: {
        type: Number,
        default: 0
    },
    date_update: {
        type: Number,
        default: 0
    },
    tdcs_type_quyen_xoa: {
        type: Number,
        default: 0
    }
},
    {
        collection: "QLTS_TheoDoiCongSuat",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TheoDoiCongSuat", model_TheoDoiCongSuat);