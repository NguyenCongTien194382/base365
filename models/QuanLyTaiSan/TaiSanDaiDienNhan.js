const mongoose = require("mongoose");
const model_TaiSanDaiDienNhan = new mongoose.Schema({
    _id: {
        type: Number,
       
    },
    id_cty_dd: {
        type: Number
    },
    id_ts_dd_nhan: {
        type: Number
    },
    id_nv_dd_nhan: {
        type: Number
    },
    sl_dd_nhan: {
        type: Number
    },
    day_dd_nhan: {
        type: Number
    }
},
    {
        collection: "QLTS_TaiSanDaiDienNhan",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TaiSanDaiDienNhan", model_TaiSanDaiDienNhan);