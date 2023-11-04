const mongoose = require("mongoose");
const model_TepDinhKem = new mongoose.Schema({
    tep_id: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number
    },
    id_ts: {
        type: Number
    },
    tep_ten: {
        type: String
    },
    tep_ngay_upload: {
        type: Number
    }
},
    {
        collection: "QLTS_TepDinhKem",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TepDinhKem", model_TepDinhKem);