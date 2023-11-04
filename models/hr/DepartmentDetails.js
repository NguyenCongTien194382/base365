const mongoose = require('mongoose');
const HR_DepartmentDetailSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    comId: {
        type: Number,
        required: true,
    },
    depId: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
}, {
    collection: 'HR_DepartmentDetails',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_DepartmentDetails", HR_DepartmentDetailSchema);