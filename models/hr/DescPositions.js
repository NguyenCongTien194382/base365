const mongoose = require('mongoose');
const HR_DescPositionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    positionId: {
        type: Number,
        required: true,
    },
    comId: {
        type: Number,
        required: true,
    },
    description	: {
        type: String,
        required: true,
    }
}, {
    collection: 'HR_DescPositions',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_DescPositions", HR_DescPositionSchema);