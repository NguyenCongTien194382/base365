const mongoose = require("mongoose");
const model_NhomTaiSan= new mongoose.Schema({
    id_nhom: {
        type: Number,
        require : true,
        unique: true
    },
    ten_nhom: {
        type: String
    },
    id_cty: {
        type: Number
    },
    nhom_type_quyen: {
        type: Number,
        default : 0
    },
    nhom_id_ng_xoa: {
        type: Number,
        default : 0
    },
    nhom_da_xoa: {
        type: Number,
        default : 0
    },
    nhom_date_create: {
        type: Number
    },
    nhom_date_delete:{
        type : Number,
        default : 0
    },
    nhom_type_quyen_xoa:{
        type : Number,
        default : 0
    }
},{
    collection: "QLTS_Nhom_Tai_San",
    versionKey: false
}
);
module.exports = mongoose.model("QLTS_Nhom_Tai_San",model_NhomTaiSan )