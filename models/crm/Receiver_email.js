const mongoose = require("mongoose");
const receiver_email = new mongoose.Schema({
    id: {
        type: Number
    },
    name_group: {
        type: String
    },
    supplier: {
        type: Number
    },
    company_id: {
        type: Number
    },
    user_create_id: {
        type: Number
    },
    user_create_type: {
        type: Number
    },
    user_edit_id: {
        type: Number
    },
    user_edit_type: {
        type: Number
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    },
    is_delete: {
        type: Number
    }
}, {
    collection: "CRM_receiver_email"
});
module.exports = mongoose.model("CRM_receiver_email", receiver_email)
