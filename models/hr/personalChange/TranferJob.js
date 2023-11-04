const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TranferJobSchema = new Schema({
    // id tu dong tang
    _id: {
        type: Number,
        required: true,
    },

    ep_id: {
        type: Number,
        required: true
    },
    com_id: {
        type: Number,
        required: true
    },

    dep_id: {
        type: Number,
        default: 0,
    },

    position_id: {
        type: Number,
        require: true,
    },

    decision_id: {
        type: Number,
        require: true
    },

    created_at: {
        type: Date,
        require: true,
        default: null
    },

    decision_id: {
        type: Number,
        default: 0,
    },
    // ly do
    note: {
        type: String,
        default: null,
    },

    mission: {
        type: String,
        default: null,
    },
}, {
    collection: 'HR_TranferJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_TranferJobs", TranferJobSchema);