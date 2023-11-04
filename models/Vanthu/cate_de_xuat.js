const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_cate_de_xuatSchema = new Schema({
   _id: { // id của loại đề xuất
        type: Number,
        required: true
    },
    cate_dx: { //
        type: Number,

    },
    name_cate_dx: {// tên của loại đề xuất
        type: String,

    },
    com_id: { // id của công ty
        type: Number,

    },
    mieuta_maudon: { // mô tả của đề xuất
        type: String,

    },
    date_cate_dx: {
        type: Number,

    },
    money_cate_dx : {
        type : Number,
        default : null
    },

    hieu_luc_cate: {
        type: Number,

    },
    kieu_duyet_cate: {
        type: Number,

    },
    user_duyet_cate: {
        type: String,

    },
    ghi_chu_cate: {
        type: String,

    },
    created_date: {
        type: Number,

    },
    update_time: {
        type: Number,

    },
    time_limit: {
        type: Number,

    },
    time_limit_l: {
        type: Number,

    },
    trang_thai_dx: {
        type: Number,
        default : 1

    }
})
module.exports = mongoose.model("Vanthu_cate_de_xuat", Vanthu_cate_de_xuatSchema);