const mongoose = require("mongoose");
const model_TaiSanViTri = new mongoose.Schema({
    tsvt_id: {
        type: Number,
        require : true,
        unique: true
    },
    tsvt_cty: {
        type: Number
    },
    tsvt_taisan: {
        type: Number
    },
    tsvt_vitri: {
        type: Number
    },
    tsvt_soluong: {
        type: Number,
        default : 0
    }
},
    {
        collection: "QLTS_TaiSanViTri",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TaiSanViTri", model_TaiSanViTri);