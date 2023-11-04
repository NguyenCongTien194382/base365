const mongoose = require('mongoose');
const history_edit_customer = new mongoose.Schema({
    id: {
        type: Number,
        require : true
    },
    customer_id: {
        type: Number
    },
    content: {
        type: String
    },
    contact_id: {
        type: Number
    },
    type: {
        type: Number
    },
    created_at: {
        type: Number
    }
}, {
    collection: "CRM_history_edit_customer"
});
module.exports = mongoose.model("CRM_history_edit_customer", history_edit_customer);
