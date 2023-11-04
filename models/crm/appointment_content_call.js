const mongoose = require("mongoose");
const appointment_content_call = new mongoose.Schema({
    id: {
        type: Number
    },
    id_appointment: {
        type: Number
    },
    id_cus: {
        type: Number
    },
    content_call: {
        type: String
    },
    created_at: {
        type: Date
    }
}, {
    collection: "CRM_appointment_content_call"
});
module.exports = mongoose.model("CRM_appointment_content_call", appointment_content_call);