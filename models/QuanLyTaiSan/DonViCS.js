const mongoose = require("mongoose");
const model_DonViCS = new mongoose.Schema({
    id_donvi: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number,
        default : 0
    },
    ten_donvi: {
        type: String,
        default : ''
    },
    mota_donvi: {
        type: String,
        default : ''

    },
    dvcs_type_quyen: {
        type: Number,
        default : 0
    },
    dvcs_id_ng_xoa: {
        type: Number,
        default : 0
    },
    donvi_xoa: {
        type: Number,
        default : 0
    },
    dvcs_date_create: {
        type: Number,
        default : 0
    },
    dvcs_date_delete: {
        type: Number,
        default : 0
    },
    dvcs_type_quyen_xoa: {
        type: Number,
        default : 0
    },
}, {
    collection: "QLTS_Don_Vi_CS",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Don_Vi_CS", model_DonViCS);