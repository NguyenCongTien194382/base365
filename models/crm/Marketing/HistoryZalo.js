const mongoose = require('mongoose');
const crm_history_zalo = new mongoose.Schema({
    id: {
        type: Number,
        require: true
    },
    emp_id: { //id nhân viên gửi tin nhắn
        type: Number,
        default: 0
    },
    company_id: {
        type: Number,
        default: 0
    },
    phone_number: { //sdt khách hàng nhận
        type: String,
        default: ''
    },
    created_at: { // thời gian tạo 
        type: Date,
        default: new Date()
    },
    message_id: { //ID của tin nhắn của zalo
        type: String,
        default: ''
    },
    templateId: {
        type: String,
        default: ''
    }
}, {
    collection: 'CRM_history_zalo',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CRM_history_zalo", crm_history_zalo);
