const mongoose = require("mongoose");
const model_Mat = new mongoose.Schema({
    mat_id: {
        type: Number,
        require : true,
        unique: true
    },
    id_cty: {
        type: Number
    },
    mat_taisan: {
        type: Number
    },
    id_ng_lam_mat: {
        type: Number
    },
    id_ng_nhan_denbu: {
        type: Number
    },
    id_ng_tao: {
        type: Number
    },
    id_ng_duyet: {
        type: Number
    },
    mat_type_quyen_duyet: {
        type: Number
    },
    mat_giatri: {
        type: Number
    },
    yc_denbu: {
        type: Number
    },
    mat_ngay: {
        type: Number
    },
    hinhthuc_denbu: {
        type: Number
    },
    mat_soluong: {
        type: Number
    },
    tien_denbu: {
        type: String
    },
    mat_trangthai: {
        type: Number
    },
    mat_lydo: {
        type: String
    },
    mat_lydo_tuchoi: {
        type: String
    },
    mat_han_ht: {
        type: Number
    },
    pt_denbu: {
        type: Number
    },
    giatri_ts: {
        type: Number
    },
    loai_thanhtoan: {
        type: Number
    },
    ngay_thanhtoan: {
        type: Number
    },
    so_tien_da_duyet: {
        type: String
    },
    sotien_danhan: {
        type: String,
    },
    ngay_duyet: {
        type: Number
    },

    mat_type_quyen: {
        type: Number
    },
    type_quyen_nhan_db: {
        type: Number
    },
    mat_id_ng_xoa: {
        type: Number
    },
    xoa_dx_mat: {
        type: Number,
        default: 0
    },
    mat_date_create: {
        type: Number
    },
    mat_date_delete: {
        type: Number
    },
    mat_type_quyen_xoa: {
        type: Number
    }
},
    {
        collection: "QLTS_Mat",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Mat", model_Mat); 