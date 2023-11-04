const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuitJobNewSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    
    ep_id: {
        type: Number,
        required: true
    },

    com_id: {
        type: Number,
        required: true
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
        require: true,
        default: null
    },
    // ly do
    note: {
        type: String,
        default: null,
    },
    type:{
        type:Number
    }
},{
    collection: 'HR_QuitJobNews',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_QuitJobNews",QuitJobNewSchema);