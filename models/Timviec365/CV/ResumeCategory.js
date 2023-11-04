// Ngành Sơ yếu lý lịch
const mongoose = require('mongoose');
const ResumeCategorySchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: Number
    },
    alias: {
        type: String
    },
    metaH1: {
        type: String
    },
    content: {
        type: String
    },
    cId: {
        type: Number
    },
    metaTitle: {
        type: String
    },
    metaKey: {
        type: String
    },
    metaDes: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'ResumeCategory',
    versionKey: false
});

module.exports = mongoose.model("ResumeCategory", ResumeCategorySchema)