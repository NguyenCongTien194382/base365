const mongoose = require('mongoose');
const QLC_EmployeeHistorySchema = new mongoose.Schema({
    hs_id: {
        type: Number,
        required: true,
    },
    hs_ep_id: {
        type: Number,
        required: true,
    },
    hs_com_id : {
        type: Number,
        required: true
    },
    hs_dep_id : {
        type: Number,
        default: 0
    },
    hs_group_id	: {
        type: Number,
        default: 0 
    },
    hs_resign_id : {
        type: Number,
        default: 0 
    },
    hs_time_start : {
        type: Date,
        default: null
    },
    hs_time_end	: {
        type: Date,
        default: null
    },
}, {
    collection: 'QLC_EmployeeHistories',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("QLC_EmployeeHistories", QLC_EmployeeHistorySchema);