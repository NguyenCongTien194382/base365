const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PushNewsTimeSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    time: {
        type: String,
        required: true,
    }
}, {
    collection: 'RN365_PushNewsTime',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_PushNewsTime", PushNewsTimeSchema);