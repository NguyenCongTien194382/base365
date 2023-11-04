const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_status = new Schema({
    stt_id: {
        type: Number,
        require: true,

    },
    stt_name: {
        type: String
    },
    com_id: {
        type: Number
    },
    created_user: {
        type: Number
    },
    type_created: {
        type: Number
    },
    status: {
        type: Number
    },
    is_delete: {
        type: Number
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
}, {
    collection: 'CRM_customer_status',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_status", crm_customer_status);