const mongoose = require('mongoose');
const HR_EmployeePolicySpecificSchema = new mongoose.Schema({
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
    employeePolicyId: {
        type: Number,
    },
    timeStart: {
        type: Date,
        required: true,
    },
    supervisorName	: {
        type: String,
        required: true,
    },
    description	: {
        type: String,
    },
    content	: {
        type: String,
        required: true,
    },
    applyFor	: {
        type: String,
        required: true,
    },
    isDelete	: {
        type: Number,
        default:0   
    },
    createdBy	: {
        type: String,
        required: true,
    },
    file	: {
        type: String,
    },
    createdAt	: {
        type: Date,
    },
    updatedAt	: {
        type: Date,
       
    },
    deletedAt	: {
        type: Date,
    },
}, {
    collection: 'HR_EmployeePolicySpecifics',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_EmployeePolicySpecifics", HR_EmployeePolicySpecificSchema);