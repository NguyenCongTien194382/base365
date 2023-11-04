const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AppointSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    
    ep_id: {
        type: Number,
    },
    
    current_position: {
        type: Number,
        default: 0,
    },
    
    current_dep_id: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
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
},{
    collection: 'HR_Appoints',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Appoints",AppointSchema);