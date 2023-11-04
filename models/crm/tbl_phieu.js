const mongoose = require('mongoose');
const tbl_phieu = new mongoose.Schema({
    id: {
        type: Number
    },
    company_id: {
        type: Number
    },
    name: {
        type: String
    },
    number: {
        type: Number
    },
    user_create: {
        type: Number
    },
    money: {
        type: Number,

    },
    money_history: {
        type: Number
    },
    contract_id: {
        type: Number
    },
    content: {
        type: String
    },
    supplier_id: {
        type: Number,
        default: null
    },
    id_customer: {
        type: Number,
        default: null
    },
    name_unit: {
        type: String
    },
    user_contact_name: {
        type: String
    },
    user_contact_phone: {
        type: String
    },
    type: {
        type: Number
    },
    status: {
        type: Number
    },
    accepted: {
        type: Number
    },
    site: {
        type: Number,
        default: null
    },
    is_delete: {
        type: Number,

    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    },
    date_created: {
        type: Number
    },
    date_receit: {
        type: Number,
        default: null
    }

},
    {
        collection: 'CRM_phieu',
        versionKey: false,
        timestamp: true
    });
module.exports = mongoose.model("CRM_phieu", tbl_phieu);