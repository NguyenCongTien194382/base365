const mongoose = require('mongoose');
const Schema = mongoose.Schema
const AdminMenuOrderSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    adminId: {
        type: Number,
        require: true
    },
    moduleId: {
        type: Number,
        require: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    collection: 'RN365_AdminMenuOrder',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_AdminMenuOrder", AdminMenuOrderSchema);