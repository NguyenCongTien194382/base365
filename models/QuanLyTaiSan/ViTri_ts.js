const mongoose = require("mongoose");
const model_ViTri_ts = new mongoose.Schema({
    id_vitri: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number
    },
    vi_tri: {
        type: String
    },
    dv_quan_ly: {
        type: Number,
        default : 0
    },
    quyen_dv_qly: {
        type: Number
    },
    ghi_chu_vitri: {
        type: String,
        default :""
    },
},
    {
        collection: "QLTS_ViTri_ts",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ViTri_ts", model_ViTri_ts);