const mongoose = require('mongoose');
const shareCustomer = new mongoose.Schema({
    id: {
        type: Number
    },
    customer_id: {
        type: Number
    },
    emp_share: {
        type: Number
    },
    dep_id: {
        type: Number
    },
    receiver_id: {
        type: Number
    },
    role: {
        type: String
    },
    share_related_list: {
        type: Number
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }
},
    {
        collection: "CRM_shareCustomer",
        versionKey: false,
        timestamps: true
    });
module.exports = mongoose.model('CRM_shareCustomer', shareCustomer);