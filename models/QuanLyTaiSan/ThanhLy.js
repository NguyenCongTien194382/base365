const mongoose = require("mongoose");
const model_ThanhLy = new mongoose.Schema({
    tl_id: {
        type: Number,
        required: true,
        unique: true
    },
    thanhly_taisan: {
        type: Number,    
        default: 0,
    },
    tl_id_bb_cp: {
        type: Number,
        default: 0,
    },
    id_cty: {
        type: Number,
        default: 0,
    },
    id_ngtao: {
        type: Number,
        default: 0,
    },
    id_tl_phongban: {
        type: Number,
        default: 0,
    },
    id_ngdexuat: {
        type: Number,
        default: 0,
    },
    id_ng_duyet: {
        type: Number,
        default: 0,
    },
    ngay_duyet: {
        type: Number,
        default: 0,
    },
    type_quyen_duyet: {
        type: Number,
         default: 0,
    },
    tl_ngay : {
        type : Number,
         default: 0,
    },
    tl_soluong : {
        type : Number,
         default: 0,
    },
    tl_giatri : {
        type : Number,
         default: 0,
    },
    tl_sotien : {
        type : Number,
         default: 0,
    },
    tl_lydo : {
        type : String
    },
    tl_lydo_tuchoi : {
        type : String
    },
    tl_trangthai : {
        type : Number,
         default: 0,
    },
    tl_loai_gt : {
        type : Number,
         default: 0,
    },
    tl_phantram : {
        type : Number,
         default: 0,
    },
    tl_type_quyen : {
        type : Number,
         default: 0,
    },
    tl_id_ng_xoa : {
        type : Number,
         default: 0,
    },
    xoa_dx_tl : {
        type : Number,
         default: 0,
    },
    tl_date_create : {
        type : Number,
         default: 0,
    },
    tl_date_delete : {
        type : Number,
         default: 0,
    },
    tl_type_quyen_xoa : {
        type : Number,
         default: 0,
    }
},
    {
        collection: "QLTS_ThanhLy",
        versionKey: false
    });
module.exports = mongoose.model("QLTS__ThanhLy", model_ThanhLy);