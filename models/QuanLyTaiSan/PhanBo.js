const mongoose = require("mongoose");
const model_PhanBo = new mongoose.Schema({
    id_pb: {
        type: Number,
        require : true,
        unique: true
    },
    id_cty: {
        type: Number
    },
    id_ts: {
        type: Number
    },
    gia_tri: {
        type: Number
    },
    soky_pb: {
        type: Number
    },
    loai_ky: {
        type: Number
    },
    gt_da_pb: {
        type: Number
    },
    gt_cho_pb: {
        type: Number
    },
    ngay_batdau: {
        type: Number
    },
    date_create: {
        type: Number
    }

}, {
    collection: "QLTS_Phan_Bo",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Phan_Bo", model_PhanBo);