const mongoose = require('mongoose');
const HR_EmployeePolicySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: String,
        required: true,
    },
    timeStart: {
        type: Date,
        required: true,
    },
    supervisorName	: {
        type: String,

    },
    description	: {
        type: String,
        required: true,
    },
    isDelete	: {
        type: Number,
        default:0
    },
    comId	: {
        type: Number,
        
    },
    file	: {
        type: String,
    },
    createdAt	: {
        type: Date,
    },
    deletedAt	: {
        type: Date,
    },
}, {
    collection: 'HR_EmployeePolicys',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_EmployeePolicys", HR_EmployeePolicySchema);