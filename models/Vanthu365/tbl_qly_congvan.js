const mongoose = require('mongoose');
const tbl_qly_congvan = new mongoose.Schema({
    _id: {
        type: Number,
    },
    cv_id_vb: {
        type: Number,
        default: null
    },
    cv_id_book: {
        type: Number,
        default: 0
    },
    cv_name: {
        type: String
    },
    cv_kieu: {
        type: String,
        max: 255,
        default: null
    },
    cv_so: {
        type: String
    },
    cv_type_soan: {
        type: Number
    },
    cv_soan_ngoai: {
        type: String,
        default: null
    },
    cv_phong_soan: {
        type: Number,
        default: null
    },
    cv_user_soan: {
        type: Number,
        default: null
    },
    cv_name_soan: {
        type: String,
        max: 255,
        default: null
    },
    cv_date: {
        type: Number,
        default: null
    },
    cv_user_save: {
        type: Number,
        default: null
    },
    cv_user_ky: {
        type: Number,
        default: null
    },
    cv_type_nhan: {
        type: String,
        default: null
    },

    cv_nhan_noibo: {
        type: Number,
        default: null
    },
    cv_nhan_ngoai: {
        type: String,
        default: null
    },
    cv_type_chuyenden: {
        type: String,
        max: 255,
        default: null
    },
    cv_chuyen_noibo: {
        type: Number,
        default: null
    },
    cv_chuyen_ngoai: {
        type: String,
        max: 255,
        default: null
    },
    cv_trich_yeu: {
        type: String
    },
    cv_ghi_chu: {
        type: String
    },
    cv_file: {
        type: String,
        max: 255,
        default: null
    },
    cv_type_xoa: {
        type: Number,
        default: 0,
    },
    cv_type_user_xoa: {
        type: Number,
        default: null
    },
    cv_user_xoa: {
        type: Number,
        default: null
    },
    cv_time_xoa: {
        type: Number,
        default: null
    },

    cv_type_loai: {
        type: Number
    },
    cv_usc_id: {
        type: Number
    },
    cv_time_create: {
        type: Number
    },
    cv_time_update: {
        type: Date
    },
    cv_type_kp: {
        type: Number,
        default: 0
    },
    cv_type_user_kp: {
        type: Number,
        default: null
    },
    cv_user_kp: {
        type: Number,
        default: null
    },
    cv_time_kp: {
        type: Number,
        default: null
    },
    cv_type_edit: {
        type: Number,
        default: 0
    },
    cv_time_edit: {
        type: Number,
        default: null
    },
    cv_type_hd: {
        type: Number,
        default: 0
    },
    cv_status_hd: {
        type: Number,
        default: 0
    },
    cv_money: {
        type: Number,
        default: null
    }
});
module.exports = mongoose.model("Vanthu_quanLiCongVan", tbl_qly_congvan);