const mongoose = require("mongoose");
const call_history = new mongoose.Schema({
    id: {
        type: Number
    },
    phone: {
        type: String
    },
    extension: {
        type: Number
    },
    com_id: {
        type: Number
    },
    created_at: {
        type: Number
    }
}, {
    collection: "CRM_call_history"
});
module.exports = mongoose.model("CRM_call_history", call_history);