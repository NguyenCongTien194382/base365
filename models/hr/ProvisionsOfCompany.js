const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvisionsOfCompany = new Schema({
    _id: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isDelete: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    timeStart: {
        type: Date,
        default: Date.now(),
    },
    supervisorName: {
        type: String,
    },
    comId: {
        type: Number,
    },
    file: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    deletedAt: {
        type: Date,
    }
});

const RegulationGroupModel = mongoose.model('HR_ProvisionsOfCompany', ProvisionsOfCompany);

module.exports = RegulationGroupModel;