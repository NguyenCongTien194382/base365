const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionStructSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    com_id: {
        type: Number,
        required: true
    },
    position_id: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
}, {
    collection: 'HR_PositionStructs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_PositionStructs', PositionStructSchema);

