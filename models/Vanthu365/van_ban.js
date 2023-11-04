const mongoose = require("mongoose");
const vanBan = new mongoose.Schema({
    _id: {
        type: Number
    },
    title_vb: {
        type: String,
        max: 255
    },
    des_vb: {
        type: String,

    },
    so_vb: {
        type: String,
        max: 255
    },
    nd_vb: {
        type: String
    },
    book_vb: {
        type: Number
    },
    time_ban_hanh: {
        type: Date,
    },
    time_hieu_luc: {
        type: Date,
    },
    nhom_vb: {
        type: Number,
    },
    user_send: {
        type: Number
    },
    name_user_send: {
        type: String,
        max: 255,
    },
    com_user: {
        type: Number
    },
    user_nhan: {
        type: String,
        max: 255
    },
    user_cty: {
        type: Number
    },
    user_forward: {
        type: String,
        max: 255
    },
    type_thu_hoi: {
        type: Number
    },
    gui_ngoai_cty: {
        type: Number
    },
    mail_cty: {
        type: String,
        max: 255
    },

    name_com: {
        type: String,
        max: 255
    },
    file_vb: {
        type: String,
        max: 255
    },
    trang_thai_vb: {
        type: Number
    },
    duyet_vb: {
        type: Number
    },

    type_xet_duyet: {
        type: Number
    },
    thoi_gian_duyet: {
        type: Date
    },
    nguoi_xet_duyet: {
        type: String,
        max: 255
    },


    nguoi_theo_doi: {
        type: String,
        max: 255
    },

    nguoi_ky: {
        type: String,
        max: 255
    },
    so_van_ban: {
        type: Number
    },
    phieu_trinh: {
        type: String,
        max: 255
    },
    chuc_vu_nguoi_ky: {
        type: String,
        max: 255
    },
    ghi_chu: {
        type: String,
        max: 255
    },
    type_khan_cap: {
        type: Number
    },
    type_bao_mat: {
        type: Number
    },
    type_tai: {
        type: Number
    },
    type_duyet_chuyen_tiep: {
        type: Number
    },
    type_nhan_chuyen_tiep: {
        type: Number
    },
    type_thay_the: {
        type: Number
    },
    created_date: {
        type: Number
    },
    type_duyet: {
        type: Number,
    },
    update_time: {
        type: Number
    }



});
module.exports = mongoose.model('Vanthu_van_ban', vanBan);