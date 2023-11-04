const mongoose = require("mongoose");
const account_api = mongoose.Schema({
    id: {
        type: Number
    },
    com_id: {
        type: Number
    },
    account: {
        type: String
    },
    password: {
        type: String
    },
    switchboard: {
        type: String
    },
    domain: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number

    }
}, {
    collection: "CRM_account_api"
});
module.exports = mongoose.model('CRM_account_api', account_api);