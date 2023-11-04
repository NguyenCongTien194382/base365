const mongoose = require('mongoose');
const Schema = mongoose.Schema
const SearchSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    keySearch: {
        type: String,
        default: null,
    },
    userId: {
        
        type: Number,
        required: true,
    },
    createdAt: {
        
        type: Date,
        default: Date.now(),
    },
    count: {
        
        type: Number,
        default: 0,
    },
    buySell: {
        
        type: Number,
        default: 2,
    }

}, {
    collection: 'RN365_Search',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Search", SearchSchema);