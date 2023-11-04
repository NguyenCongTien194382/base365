const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GetJob = new Schema({
    //Id 
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    
    canId: {
        type: Number,
        require: true
    },
    resiredSalary: {
        type: String,
        default: 0
    },
    salary: {
        type: String,
        default: 0
    },
    interviewTime: {
        type: Date,
        default: null
    },
    empInterview: {
        type: Number,
        require: true
    },
    note: {
        type: String,
        default: null
    },
    email: {
        type: String,
        require: true
    },
    contentSend: {
        type: String,
        default: null
    },
    isSwitch: {
        type: Number,
        default: 0
    },
    isDelete: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: 'HR_GetJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_GetJobs", GetJob);