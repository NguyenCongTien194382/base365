const mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const adminUserSchema = new mongoose.Schema({
    adm_id: {
        type: Number,
        required: true,
        unique: true
    },
    adm_loginname: {
        type: String,
        default: null
    },
    adm_password: {
        type: String,
        default: null
    },
    adm_name: {
        type: String,
        default: null
    },
    adm_email: {
        type: String,
        default: null
    },
    adm_author: {
        type: String,
        default: null
    },
    adm_address: {
        type: String,
        default: null
    },
    adm_phone: {
        type: String,
        default: null
    },
    adm_mobile: {
        type: String,
        default: null
    },
    adm_access_module: {
        type: String,
        default: null
    },
    adm_access_category: {
        type: String,
        default: null
    },
    adm_date: {
        type: Number,
        default: 0
    },
    adm_isadmin: {
        type: Number,
        default: 0
    },
    adm_active: {
        type: Number,
        default: 1
    },
    lang_id: {
        type: Number,
        default: 1
    },
    adm_delete: {
        type: Number,
        default: 0
    },
    adm_all_category: {
        type: Number,
        default: 0
    },
    adm_edit_all: {
        type: Number,
        default: 1
    },
    admin_id: {
        type: Number,
        default: 4
    },
    // 1 kinh doanh , 2 nhập liệu ,3 tuyển dụng
    adm_bophan: {
        type: Number,
        default: 0
    },
    adm_ntd: {
        type: Number,
        default: 0,
    },
    emp_id: {
        type: Number,
        default: 0,
    },
    adm_nhaplieu: {
        type: Number,
        default: 0,
    },
    adm_rank: {
        type: Number,
        default: 0,
    },
    emp_id_chat: {
        type: Number,
        default: 0,
    },
    adm_work247: {
        type: Number,
        default: 0,
    },
}, {
    collection: 'AdminUser',
    versionKey: false,
    timestamp: true
})
module.exports = connection.model("AdminUser", adminUserSchema);