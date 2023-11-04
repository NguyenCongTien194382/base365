const mongoose = require("mongoose");
const connnect_api_config = new mongoose.Schema({
    id: {
        type: Number
    },
    company_id: {
        type: Number,
    },
    appID: {
        type: String
    },
    webhook: {
        type: String
    },
    token: {
        type: String
    },
    user_edit_id: {
        type: Number
    },
    user_edit_type: {
        type: Number
    },
    stt_conn: {
        type: Number
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }

}, {
    collection: "CRM_connnect_api_config"
});
module.exports = mongoose.model("CRM_connnect_api_config", connnect_api_config);