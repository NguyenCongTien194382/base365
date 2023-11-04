//bảng giá
const mongoose = require('mongoose');
const PriceListSchema = new mongoose.Schema({
    bg_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    bg_tuan: {
        type: String
    },
    bg_gia: {
        type: String
    },
    bg_chiet_khau: {
        type: String
    },
    bg_thanh_tien: {
        type: String
    },
    bg_handung: {
        type: String
    },
    bg_the: {
        type: String
    },
    bg_vat: {
        type: String
    },
    bg_quyenloi: {
        type: String
    },
    bg_uudai1: {
        type: String
    },
    bg_uudai2: {
        type: String
    },
    bg_uudai3: {
        type: String
    },
    bg_cm1: {
        type: String
    },
    bg_cm2: {
        type: String
    },
    bg_cm3: {
        type: String
    },
    bg_cm_logo: {
        type: String
    },
    bg_show: {
        type: Number,
        default: 0
    },
    bg_tk: {
        type: String
    },
    bg_do: {
        type: Number,
        default: 0
    },
    bg_hp: {
        type: Number
    },
    /**
    * 1: Hấp dẫn
    * 4: Thương hiệu
    * 5: Tuyển gấp
    * 6: Trang ngành
    */
    bg_type: {
        type: String
    },
    bg_time: {
        type: Number,
        default: 0
    },
    bg_hoso: {
        type: Number,
        default: 0
    },
    bg_gift_hoso: {
        type: Number,
        default: 0
    },
    bg_time_gift_hoso: {
        type: Number,
        default: 0
    },
    bg_vip_duration: {
        type: Number,
        default: 0
    },
    bg_ql_hd: {
        type: String
    },
    bg_ud_hd: {
        type: String
    },
    api_crm: {
        type: Number
    },
    time_type: {
        type: Number
    }
}, {
    collection: 'PriceList',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('PriceList', PriceListSchema);