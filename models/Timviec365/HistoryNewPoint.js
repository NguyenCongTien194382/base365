const mongoose = require('mongoose');
const Tv365HistoryNewPointSchema = new mongoose.Schema({
    nh_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    nh_new_id: {
        type: Number,
        default: 0
    },
    nh_point: {
        type: Number,
        default: 0
    },
    nh_type_point: {
        type: Number,
        default: 0
    },
    nh_created_at: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365HistoryNewPoint',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365HistoryNewPoint", Tv365HistoryNewPointSchema);