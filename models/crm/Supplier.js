const mongoose = require('mongoose');
const supplier = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone_number: {
        type: String
    },
    address: {
        type: String
    },
    contact_name: {
        type: String
    },
    contact_phone: {
        type: String
    },
    bank_id: {
        type: Number
    },
    account_number: {
        type: Number
    },
    ctk: {
        type: String
    },
    mst: {
        type: Number
    },
    description: {
        type: String
    },
    emp_id: {
        type: Number
    },
    company_id: {
        type: Number
    },
    group_id: {
        type: Number
    },
    is_delete: {
        type: Number
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }
}, {
    collection: "CRM_supplier"
});
module.exports = mongoose.model("CRM_supplier", supplier);