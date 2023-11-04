const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CatVlSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        default: null,
    },
    lq: {
        type: String
    },
    ut: {
        type: String,

    },
    active: {
        type: Number,
        default: 0,
    },

}, {
    collection: 'RN365_CatVls',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_CatVls", CatVlSchema);