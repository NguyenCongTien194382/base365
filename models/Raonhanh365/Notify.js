const mongoose = require('mongoose');
const Schema = mongoose.Schema
const NotifySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    from: {
        
        type: Number,
        required: true,
    },
    newId: {
        
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
    
    type: {
        //ten
        type: Number,
        default: null,
    },
    createdAt: {
        //avatar
        type: Date,
        default: Date.now(),
    },
    content: {
        //avatar
        type: String,
        default: null,
    }

}, {
    collection: 'RN365_Notify',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Notify", NotifySchema);