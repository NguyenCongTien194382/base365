const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const HR_Resignschema = new Schema({
    // id tu dong tang
    id: {
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

    shift_id: {
        type: Number,
        default: null,
    },
    type: {
        type:Number
    }
}, {
    collection: 'HR_Resigns',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Resign", HR_Resignschema);