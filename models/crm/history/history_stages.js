const mongoose = require('mongoose');
const history_stages = new mongoose.Schema({
    id: {
        type: Number
    },
    chance_id: {
        type: Number
    },
    stages_id: {
        type: Number
    },
    stages_name: {
        type: String
    },
    money: {
        type: Number
    },
    success_rate: {
        type: Number
    },
    expected_sales: {
        type: Number
    },
    time_complete: {
        type: Number
    },
    user_id_edit: {
        type: Number
    },
    created_at: {
        type: Number
    },
    update_at: {
        type: Number
    }
},
    {
        collection: "CRM_history_stages"
    });
module.exports = mongoose.model("CRM_history_stages", history_stages);