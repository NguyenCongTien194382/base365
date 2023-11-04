const mongoose = require("mongoose");
const model_DanhSachCapPhat = new mongoose.Schema({
    id_ds_capphat: {
        type: Number,
        unique: true
    },
    date_capphat: {
        type: Number
    },
    id_nv: {
        type: Number
    },
    id_pb: {
        type: Number
    },
    id_daidien_pb: {
        type: Number
    },
    soluong_capphat: {
        type: Number
    },
    vitri_TS: {
        type: String
    },
    lydo: {
        type: String

    },
    date_create: {
        type: Number
    },
    date_delete: {
        type: Number,
    }
},
    {
        collection: "QLTS_Danh_Sach_Cap_Phat",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Danh_Sach_Cap_Phat", model_DanhSachCapPhat);