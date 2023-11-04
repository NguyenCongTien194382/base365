const mongoose = require("mongoose");
const model_Huy = new mongoose.Schema({
    huy_id: {
        type: Number,
        default:0,
        unique: true
    },
    huy_taisan: {
        type: Number,
        default:0
    }
    ,
    id_ng_dexuat: {
        type: Number,
        default:0
    },
    huy_id_bb_cp: {
        type: Number,
        default:0
    },
    id_cty: {
        type: Number,
        default:0
    },
    id_ng_tao: {
        type: Number,
        default:0
    },
    id_ng_duyet: {
        type: Number,
        default:0
    },
    huy_type_quyen_duyet: {
        type: Number,
        default:0
    },
    huy_ngayduyet: {
        type: Number,
        default:0
    },
    huy_trangthai: {
        type: Number,
        default:0
    },
    huy_soluong: {
        type: Number,
        default:0
    },
    huy_lydo_tuchoi: {
        type: String
    },
    huy_lydo: {
        type: String
    },
    huy_type_quyen: {
        type: Number,
        default:0
    },
    huy_id_ng_xoa: {
        type: Number,
        default:0
    },
    xoa_huy: {
        type: Number,
        default:0
    },
    huy_date_create: {
        type: Number,
        default:0
    },
    huy_date_delete: {
        type: Number,
        default:0
    },
    huy_type_quyen_xoa: {
        type: Number,
        default:0
    },
    huy_ng_sd: {
        type: Number,
        default:0
    },
    huy_quyen_sd: {
        type: Number,
        default:0
    }

}, {
    collection: "QLTS_Huy",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Huy", model_Huy);