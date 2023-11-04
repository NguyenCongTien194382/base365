const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ModuleSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        default: null
    },
    path: {
        type: String,
        default: null
    },
    listName: {
        type: String,
        default: null
    },
    listFile: {
        type: String,
        default: null
    },
    order: {
        type: Number,
        default: 0
    },
    help: {
        type: String,
        default: null
    },
    langId: {
        type: Number,
        default: null
    },
    checkLoca: {
        type: Number,
        default: 0
    }
}, {
    collection: 'RN365_Module',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Module", ModuleSchema);