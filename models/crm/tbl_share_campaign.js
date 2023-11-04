const mongoose = require('mongoose');
const tbl_share_campaign = new mongoose.Schema({
    id: {
        type: Number
    },
    campaign_id: {
        type: Number
    },
    emp_share: {
        type: Number
    },
    type: {
        type: String
    },
    dep_id: {
        type: Number,
        default: null
    },
    receiver_id: {
        type: Number,
        default: null
    },
    receiver_name: {
        type: String
    },
    role: {
        type: String
    },
    share_related_list: {
        type: Number,
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }
},
    {
        collection: "CRM_share_campaign",
        versionKey: false,
        timestamp: true
    });
module.exports = mongoose.model("CRM_share_campaign", tbl_share_campaign);