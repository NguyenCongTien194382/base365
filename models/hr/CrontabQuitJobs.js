const mongoose = require('mongoose');
const HR_CrontabQuitJobSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    epID: {
        // id nhân viên
        type: Number,
        required: true,
    },
    comId: {
        // id công ty
        type: Number,
        required: true,
    },
    currentPosition	: {
        type: Number,
        default: null,
    },
    currentDepId: {
        //chua ro
        type: Number,
        default: null   ,
    },
    createdAt: {
       
        type: Date,
        required: true,
    },
    decisionId: {       
        type: Number,
        default: null,
    },
    note: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    shiftId: {
        type: Number,
        required: true,
    },

}, {
    collection: 'HR_CrontabQuitJobs',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_CrontabQuitJobs", HR_CrontabQuitJobSchema);