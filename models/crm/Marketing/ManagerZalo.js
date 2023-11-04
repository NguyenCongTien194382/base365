const mongoose = require('mongoose');
const crm_manager_zalo = new mongoose.Schema({
    com_id: { //id công ty
        type: Number,
        default: 0
    },
    app_id: { // id ứng dụng liên kết OA
        type: String,
        default: ''
    },
    secret_key: { //khoá bí mật ứng dụng liên kết OA
        type: String,
        default: ''
    },
    access_token: { //
        type: String,
        default: ''
    },
    refresh_token: { //
        type: String,
        default: ''
    },
    create_at: {
        type: Date,
        default: new Date()
    }
}, {
    collection: 'CRM_manager_zalo',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CRM_manager_zalo", crm_manager_zalo);
