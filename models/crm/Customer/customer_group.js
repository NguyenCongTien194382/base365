const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_group = new Schema({
    gr_id: {
        type: Number,
        unique: true,
        require: true
    },
    gr_name: {
        type: String
    },
    gr_description: {
        type: String
    },
    group_parent: {
        type: Number,
        default: 0,
    },
    company_id: {
        type: Number,
        default: 0,
        require: true
    },
    dep_id: {
        type: String,
        default: null
    },
    emp_id: {
        type: String,
        default: null
    },
    count_customer: {
        type: Number,
        default: 0,
    },
    is_delete: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Number,
        default: 0
    },
    updated_at: {
        type: Number,
        default: 0
    }
}, {
    collection: 'CRM_customer_group',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_group ", crm_customer_group);